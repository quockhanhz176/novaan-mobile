import {
    type StorageKey,
    getData,
    storeData,
} from "@/common/AsyncStorageService";
import type Post from "../types/Post";
import PostApi from "@/api/post/PostApi";
import moment from "moment";
import { getRecipeTime } from "@/pages/create-post/create-recipe/types/RecipeTime";
import type PostComment from "../types/PostComment";
import { type PostType } from "@/api/post/types/PostResponse";
import { getUrlExtension } from "@/common/utils";

const getMockPost = (): Post => ({
    id: "1",
    title: "Cách làm bánh kem (bánh gato) dâu tây tại nhà",
    description:
        "Bánh kem thường xuất hiện trong những bữa tiệc sinh nhật hay những ngày vui trong các gia đình và hội bạn thân nên được rất nhiều người yêu thích. Hôm nay Điện máy XANH sẽ vào bếp góp vào niềm vui của mọi người bằng món bánh kem (bánh gato) dâu tây thơm ngon nhé!",
    video: "015b8d24-ebc7-4b4a-8008-6f8632ebeedc.mp4",
    type: "recipe",
    difficulty: 1,
    portionQuantity: 1,
    portionType: 1,
    prepTime: { hour: 33, minute: 0 },
    cookTime: { hour: 1, minute: 27 },
    instructions: [
        {
            step: 1,
            description:
                "Sơ chế dâu tây: Dâu tây ngâm với nước muối loãng khoảng vài phút sau đó rửa sạch, để ráo và cắt đôi, bỏ cuống.",
            image: "ae155f7b-e828-48ca-b831-01e9517b72f3.jpg",
        },
        {
            step: 2,
            description:
                "Dâu tây sau khi đã sơ chế, bạn chừa lại khoảng 4 trái để trang trí, phần còn lại thì bạn trộn cùng 100gr đường để khoảng 30 phút rồi mang đi nấu. Nấu dâu tây trên lửa vừa đến khi dâu tây mềm nhũn. Sau đó bạn đem lọc qua rây, dùng thìa miết nhuyễn dâu và lọc bỏ phần bã. Đem bọc kín mứt và để ngăn mát tủ lạnh.",
            image: "f2341b44-e0d0-48d1-99ea-82c41a3ba41e.jpg",
        },
    ],
    ingredients: [
        {
            name: "bột mì đa dụng",
            amount: 110,
            unit: "gram",
        },
        {
            name: "tinh bột bắp",
            amount: 30,
            unit: "gram",
        },
    ],
    creator: {
        username: "Điện máy XANH",
        userId: "123332",
        avatar: "bcdf1b90-d48a-45ff-8480-cf4f5259e59f.jpg",
    },
    status: 0,
    isLiked: true,
    isSaved: true,
    likeCount: 203,
});

let postListData: StorageKey["reelListData"] | undefined;

const serverError = (): void => {
    // Toast.show({
    //     type: "error",
    //     text1: COMMON_SERVER_CONNECTION_FAIL_ERROR,
    // });
};

const getListData = async (): Promise<boolean> => {
    if (postListData != null) {
        return true;
    }

    // get from storage
    const newListData = await getData("reelListData");
    if (newListData != null) {
        postListData = newListData;
        return true;
    }

    // get from api
    const response = await PostApi.getPostList();
    if (response.success) {
        postListData = {
            list: response.value,
            lastItem: -1,
            lastUpdate: new Date(),
        };
        return true;
    }

    serverError();
    return false;
};

// TODO: implement busninesses when recommendation is clearer
const getPost = async (index: number): Promise<Post | null> => {
    try {
        // remove data in store
        await storeData("reelListData", null);
        await getListData();
        if (
            postListData == null ||
            index < 0 ||
            index >= postListData.list.length
        ) {
            return null;
        }

        const minimalItem = postListData.list[index];
        const postResponse = await PostApi.getPost(
            minimalItem.postId,
            minimalItem.postType === "Recipe" ? "recipe" : "tip"
        );
        if (!postResponse.success) {
            serverError();
            return null;
        }

        console.log(
            "reelServices.getPost - postResponse: " +
                JSON.stringify(postResponse)
        );

        const profile = await PostApi.getProfile(postResponse.value.creatorId);

        const creator = profile.success
            ? profile.value
            : {
                  username: "Điện máy XANH",
                  userId: "123332",
              };

        if (postResponse.value.type === "tip") {
            return {
                ...postResponse.value,
                creator,
            };
        }

        const prepDuration = moment.duration(postResponse.value.prepTime);
        const cookDuration = moment.duration(postResponse.value.cookTime);
        const prepTime = getRecipeTime(prepDuration);
        const cookTime = getRecipeTime(cookDuration);

        return {
            ...postResponse.value,
            creator,
            prepTime,
            cookTime,
        };
    } catch (e) {
        console.error(e);
        serverError();
        return null;
    }
};

const getComments = async (id: string): Promise<PostComment[] | null> => {
    const result = await PostApi.getComments(id);
    if (!result.success) {
        serverError();
        return null;
    }

    return result.value.map((commentResponse): PostComment => {
        const createdAt = moment(commentResponse.createdAt);
        return { ...commentResponse, createdAt };
    });
};

const getMockComments = (): PostComment[] => {
    return [
        {
            commentId: "0",
            userId: "12",
            username: "sanguine",
            avatar: "f2341b44-e0d0-48d1-99ea-82c41a3ba41e.jpg",
            comment: "món này hơi mặn",
            image: "f2341b44-e0d0-48d1-99ea-82c41a3ba41e.jpg",
            rating: 2,
            createdAt: moment("2023-07-16T06:56:54.474Z"),
        },
        {
            commentId: "12",
            userId: "13",
            username: "Liquid Oxygen",
            avatar: "",
            rating: 7,
            createdAt: moment("1997-03-26T06:56:54.474Z"),
        },
    ];
};

const sendComment = async (
    postId: string,
    rating: number,
    postType: PostType,
    comment?: string,
    imageUri?: string,
    previousImageId?: string,
    isEdit: boolean = false
): Promise<boolean> => {
    const result = await PostApi.sendComment(
        {
            postId,
            rating,
            postType,
            image:
                imageUri != null
                    ? {
                          uri: imageUri,
                          extension: getUrlExtension(imageUri),
                      }
                    : undefined,
            comment,
            previousImageId,
        },
        isEdit
    );

    return result.success;
};

const reelServices = {
    getMockPost,
    getPost,
    getComments,
    getMockComments,
    sendComment,
};

export default reelServices;

import {
    type StorageKey,
    getData,
    storeData,
} from "@/common/AsyncStorageService";
import type Post from "../types/Post";
import PostApi from "@/api/post/PostApi";
import moment from "moment";
import { getRecipeTime } from "@/pages/create-post/create-recipe/types/RecipeTime";

const getNextPost = (): Post => ({
    id: "1",
    title: "Cách làm bánh kem (bánh gato) dâu tây tại nhà",
    description:
        "Bánh kem thường xuất hiện trong những bữa tiệc sinh nhật hay những ngày vui trong các gia đình và hội bạn thân nên được rất nhiều người yêu thích. Hôm nay Điện máy XANH sẽ vào bếp góp vào niềm vui của mọi người bằng món bánh kem (bánh gato) dâu tây thơm ngon nhé!",
    video: "https://v.pinimg.com/videos/mc/720p/f6/88/88/f68888290d70aca3cbd4ad9cd3aa732f.mp4",
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
        console.log("minimalItem: " + JSON.stringify(minimalItem));
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

const reelServices = {
    getNextPost,
    getPost,
};

export default reelServices;

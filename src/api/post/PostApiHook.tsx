import { getData, storeData } from "@/common/AsyncStorageService";
import { type Undefinable } from "@/types/app";
import { mutateGetKey, useFetch } from "../baseApiHook";
import { useState } from "react";
import {
    type MinimalComment,
    type MinimalPost,
} from "./types/PostListResponse";
import {
    type UseSendCommentReturn,
    type UsePostCommentsReturn,
    type UsePostInfoReturn,
    type UsePostListReturn,
    type UsePostSaveReturn,
    type UsePostReportReturn,
    type UseReportCommentReturn,
    type PostInteraction,
} from "./types/hooks.type";
import type PostComment from "@/pages/reel/types/PostComment";
import type Post from "@/pages/reel/types/Post";
import { getRecipeTime } from "@/pages/create-post/create-recipe/types/RecipeTime";
import moment from "moment";
import mime from "react-native-mime-types";
import { type CommentFormInfo } from "./types/CommentInformation";
import { responseObjectValid } from "../common/utils/ResponseUtils";
import { getUserIdFromToken } from "../common/utils/TokenUtils";
import { unstable_serialize, useSWRConfig } from "swr";
import { getUserSavedUrl } from "../profile/ProfileApi";
import PostApi from "./PostApi";

const POST_LIST_URL = "content/posts";

const GET_RECIPE_URL = "content/post/recipe";
const GET_TIP_URL = "content/post/tip";

const GET_POST_COMMENTS = "content/comments";
const INTERACT_POST_COMMENT = "content/interaction/comment";

const INTERACT_POST_SAVE = "content/interaction/save";
const INTERACT_POST_LIKE = "content/interaction/like";

const INTERACT_REPORT = "content/interaction/report";

const REELS_DATA_EXP = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// For getting reel's data
export const usePostList = (): UsePostListReturn => {
    const { getReq } = useFetch({ authorizationRequired: true });

    // List of posts' id
    const [postList, setPostList] = useState<MinimalPost[]>([]);

    const fetchPostList = async (): Promise<boolean> => {
        const cachePostData = await getCacheData();
        if (cachePostData != null) {
            setPostList(cachePostData);
            return true;
        }

        const postList = await getReq(POST_LIST_URL);
        if (!responseObjectValid(postList)) {
            return false;
        }

        // Cache result to avoid re-fetching
        await storeData("reelsData", {
            data: postList,
            exp: new Date().getUTCMilliseconds() + REELS_DATA_EXP,
        });
        setPostList(postList);
        return true;
    };

    const getCacheData = async (): Promise<Undefinable<MinimalPost[]>> => {
        const cacheData = await getData("reelsData");
        if (cacheData == null) {
            return undefined;
        }

        // Invalidate cache
        if (cacheData.exp > new Date().getUTCMilliseconds()) {
            return undefined;
        }

        return cacheData.data;
    };

    return { postList, fetchPostList };
};

// For getting post info
export const usePostInfo = (): UsePostInfoReturn => {
    const { getReq } = useFetch({ authorizationRequired: true });

    const [postInfo, setPostInfo] = useState<Undefinable<Post>>(undefined);

    const fetchPostInfo = async (
        info: MinimalPost
    ): Promise<Undefinable<Post>> => {
        const requestUrl =
            info.postType === "Recipe" ? GET_RECIPE_URL : GET_TIP_URL;
        const postType: Post["type"] =
            info.postType === "Recipe" ? "recipe" : "tip";
        const postResponse = await getReq(`${requestUrl}/${info.postId}`);
        if (!responseObjectValid(postResponse)) {
            return undefined;
        }
        const authorResponse = await PostApi.getProfile(postResponse.creatorId);
        const author = authorResponse.success
            ? authorResponse.value
            : undefined;

        // Format response based on postType
        postResponse.type = postType;
        postResponse.creator = {
            username: postResponse.creatorName,
            userId: postResponse.creatorId,
            avatar: author?.avatar,
        };
        if (postType === "recipe") {
            postResponse.prepTime = getRecipeTime(
                moment.duration(postResponse.prepTime)
            );
            postResponse.cookTime = getRecipeTime(
                moment.duration(postResponse.cookTime)
            );
        }

        setPostInfo(postResponse);
        return postResponse;
    };

    // const getCacheData = async (
    //     info: MinimalPost
    // ): Promise<Undefinable<Post>> => {
    //     const cacheData = await AsyncStorage.getItem(info.postId);
    //     if (cacheData == null || cacheData === "") {
    //         return undefined;
    //     }

    //     const cache = JSON.parse(cacheData);

    //     // Invalidate cache
    //     if (cache.exp == null || cache.data == null) {
    //         return undefined;
    //     }
    //     if (cache.exp > new Date().getUTCMilliseconds()) {
    //         return undefined;
    //     }

    //     return cache.data;
    // };

    // const storeCacheData = async (post: Post): Promise<void> => {
    //     const cacheObject = {
    //         data: post,
    //         exp: new Date().getUTCMilliseconds() + POSTS_DATA_EXP,
    //     };
    //     const data = JSON.stringify(cacheObject);
    //     await AsyncStorage.setItem(post.id, data);
    // };

    return { postInfo, fetchPostInfo };
};

// For fetch/delete user comment
export const usePostComments = (): UsePostCommentsReturn => {
    const { getReq, deleteReq } = useFetch({
        authorizationRequired: true,
    });

    const [comments, setComments] = useState<PostComment[]>([]);

    const fetchComments = async (info: MinimalPost): Promise<boolean> => {
        const postComments = await getReq(
            `${GET_POST_COMMENTS}/${info.postId}`
        );
        if (!responseObjectValid(postComments)) {
            return false;
        }

        // Format postComment
        (postComments as any[]).forEach((comment) => {
            comment.createdAt = moment(comment.createdAt);
        });

        setComments(postComments);
        return true;
    };

    const deleteComment = async (info: MinimalPost): Promise<boolean> => {
        return await deleteReq(
            `${INTERACT_POST_COMMENT}/${info.postId}?postType=${info.postType}`
        );
    };

    return { comments, fetchComments, deleteComment };
};

// For sending new/edit comment
// Separate from usePostComments because this need to send formdata
export const useSendComment = (): UseSendCommentReturn => {
    const { postReq, putReq } = useFetch({
        authorizationRequired: true,
        contentType: "multipart/form-data",
        needJsonBody: false,
    });

    const sendComment = async (
        { postId, postType }: MinimalPost,
        commentInfo: CommentFormInfo,
        action: "add" | "edit"
    ): Promise<boolean> => {
        // Generate form data
        const formData = new FormData();
        formData.append("Rating", commentInfo.rating.toString());
        formData.append("PostType", postType);
        if (commentInfo.comment != null) {
            formData.append("Comment", commentInfo.comment);
        }
        if (commentInfo.image != null) {
            formData.append("Image", {
                name: `upload.${commentInfo.image.extension}`,
                uri: commentInfo.image.uri,
                type: mime.lookup(commentInfo.image.extension),
            } as any);
        }
        if (commentInfo.previousImageId != null) {
            formData.append("ExistingImage", commentInfo.previousImageId);
        }

        // Determine request type
        if (action === "add") {
            const response = await postReq(
                `${INTERACT_POST_COMMENT}/${postId}`,
                formData
            );
            return sendCommentSuccess(response);
        }

        const response = await putReq(
            `${INTERACT_POST_COMMENT}/${postId}`,
            formData
        );
        return sendCommentSuccess(response);
    };

    const sendCommentSuccess = (response: any): boolean => {
        if (!responseObjectValid(response)) {
            return false;
        }
        if (response.success != null && response.success === false) {
            return false;
        }

        return true;
    };

    return { sendComment };
};

export const useReportComment = (): UseReportCommentReturn => {
    const { postReq } = useFetch({ authorizationRequired: true });

    const reportComment = async (
        { postId, commentId, postType }: MinimalComment,
        reason: string
    ): Promise<boolean> => {
        const payload = {
            reason,
            postType,
        };
        const reportResponse = await postReq(
            `${INTERACT_REPORT}/${postId}/${commentId}`,
            payload
        );
        if (!responseObjectValid(reportResponse)) {
            return false;
        }
        return true;
    };

    return { reportComment };
};

// For like/save a post
export const usePostInteract = (): UsePostSaveReturn => {
    const { postReq } = useFetch({ authorizationRequired: true });

    const { mutate } = useSWRConfig();

    const savePost = async (
        { postId, postType, action }: PostInteraction,
        userId?: string
    ): Promise<boolean> => {
        if (userId == null) {
            userId = await getUserIdFromToken();
        }

        const payload = { postType, save: action };
        const saveResult = await postReq(
            `${INTERACT_POST_SAVE}/${postId}`,
            payload
        );
        if (!responseObjectValid(saveResult)) {
            return false;
        }

        // Trigger revalidation for profile/saved-post when send successfully
        await mutate(unstable_serialize(mutateGetKey(getUserSavedUrl(userId))));

        return true;
    };

    const likePost = async (
        { postId, postType, action }: PostInteraction,
        userId?: string
    ): Promise<boolean> => {
        if (userId == null) {
            userId = await getUserIdFromToken();
        }
        const payload = { postType, like: action };
        const likeResult = await postReq(
            `${INTERACT_POST_LIKE}/${postId}`,
            payload
        );
        if (!responseObjectValid(likeResult)) {
            return false;
        }

        return true;
    };

    return { savePost, likePost };
};

// For report a post
export const usePostReport = (): UsePostReportReturn => {
    const { postReq } = useFetch({ authorizationRequired: true });

    const reportPost = async (
        { postId, postType }: MinimalPost,
        reason: string
    ): Promise<boolean> => {
        const payload = {
            reason,
            postType,
        };
        const reportResponse = await postReq(
            `${INTERACT_REPORT}/${postId}`,
            payload
        );
        if (!responseObjectValid(reportResponse)) {
            return false;
        }
        return true;
    };

    return { reportPost };
};

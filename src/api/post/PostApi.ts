import { type DistributiveOmit, capitalizeFirstLetter } from "@/common/utils";
import BaseApi, { HttpMethod } from "../BaseApi";
import {
    type IngredientInformation,
    type InstructionInformation,
} from "./types/UploadRecipeInformation";
import type UploadRecipeInformation from "./types/UploadRecipeInformation";
import { type UploadResponse } from "./types/UploadResponse";
import mime from "react-native-mime-types";
import { type FailableResponse } from "../common/types/FailableResponse";
import type PostListResponse from "./types/PostListResponse";
import type PostResponse from "./types/PostResponse";
import type ResourceResponse from "./types/ResourceResponse";
import { type ProfileInfo } from "../profile/types";
import type CommentResponse from "./types/CommentResponse";
import { type PostType } from "./types/PostResponse";
import { getRequestPostType } from "./types/RequestPostType";
import type CommentInformation from "./types/CommentInformation";

// upload
const UPLOAD_RECIPE_URL = "content/upload/recipe";
const UPLOAD_TIP_URL = "content/upload/tips";
// download
const POST_LIST_URL = "content/posts";
const GET_RECIPE_URL = "content/post/recipe";
const GET_TIP_URL = "content/post/tip";
const GET_RESOURCE_URL = "content/download";
const GET_USER_URL = "profile";
const GET_COMMENTS_URL = "content/comments";
// interact
const POST_LIKE_URL = "content/interaction/like";
const POST_SAVE_URL = "content/interaction/save";
const POST_PUT_DELETE_COMMENT_URL = "content/interaction/comment";
const POST_REPORT_URL = "content/interaction/report";
// const COMMENT_REPORT_URL = "content/interaction/comment";

const baseApi = new BaseApi();

const uploadTip = async (
    title: string,
    description: string,
    videoUri: string,
    extension: string
): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("Video", {
        name: `upload.${extension}`,
        uri: videoUri,
        type: `video/${extension}`,
    } as any);

    const response = await baseApi.post<FormData>(UPLOAD_TIP_URL, formData, {
        timeout: 30000,
        authorizationRequired: true,
        contentType: "multipart/form-data",
        needJsonBody: false,
    });

    console.log("PostApi.uploadTip - response: " + JSON.stringify(response));

    if (!response.ok) {
        return {
            success: false,
            reason: "no",
        };
    }
    return {
        success: true,
    };
};

const uploadRecipe = async (
    information: UploadRecipeInformation
): Promise<UploadResponse> => {
    const formData = new FormData();

    const appendDefault = (field: keyof UploadRecipeInformation): void => {
        formData.append(
            capitalizeFirstLetter(field),
            information[field].toString()
        );
    };

    const appendInstruction = (
        instruction: InstructionInformation,
        field: keyof Omit<InstructionInformation, "image">,
        index: number
    ): void => {
        formData.append(
            `Instructions_${index}_${capitalizeFirstLetter(field)}`,
            instruction[field].toString()
        );
    };

    const appendIngredient = (
        ingredient: IngredientInformation,
        field: keyof IngredientInformation,
        index: number
    ): void => {
        formData.append(
            `Ingredients_${index}_${capitalizeFirstLetter(field)}`,
            ingredient[field].toString()
        );
    };

    appendDefault("title");
    appendDefault("description");
    appendDefault("difficulty");
    appendDefault("portionType");
    appendDefault("portionQuantity");
    appendDefault("prepTime");
    appendDefault("cookTime");

    information.instructions.forEach(
        (instruction: InstructionInformation, index: number): void => {
            appendInstruction(instruction, "step", index);
            appendInstruction(instruction, "description", index);
            if (instruction.image == null) {
                return;
            }

            formData.append(`Instructions_${index}_Image`, {
                name: `upload.${instruction.image.extension}`,
                uri: instruction.image.uri,
                type: mime.lookup(instruction.image.extension),
            } as any);
        }
    );
    information.ingredients.forEach(
        (information: IngredientInformation, index: number): void => {
            appendIngredient(information, "name", index);
            appendIngredient(information, "amount", index);
            appendIngredient(information, "unit", index);
        }
    );

    formData.append("Video", {
        name: `upload.${information.videoExtension}`,
        uri: information.videoUri,
        type: `video/${information.videoExtension}`,
    } as any);

    const response = await baseApi.post<FormData>(UPLOAD_RECIPE_URL, formData, {
        timeout: 30000,
        authorizationRequired: true,
        contentType: "multipart/form-data",
        needJsonBody: false,
    });

    console.log("PostApi.uploadRecipe - response: " + JSON.stringify(response));

    if (!response.ok) {
        return {
            success: false,
            reason: "no",
        };
    }
    return {
        success: true,
    };
};

const getPostList = async (): Promise<FailableResponse<PostListResponse>> => {
    return await getBase<PostListResponse>(POST_LIST_URL, "getPostList");
};

const getPost = async (
    id: string,
    type: PostResponse["type"]
): Promise<FailableResponse<PostResponse>> => {
    const url =
        type === "tip" ? `${GET_TIP_URL}/${id}` : `${GET_RECIPE_URL}/${id}`;
    const result = await getBase<DistributiveOmit<PostResponse, "type">>(
        url,
        "getPost"
    );
    if (!result.success) {
        return result;
    }

    const postResult: FailableResponse<PostResponse> = {
        success: result.success,
        value: { ...result.value, type: type as any, likeCount: 634734 },
    };

    return postResult;
};

const getResource = async (
    id: string
): Promise<FailableResponse<ResourceResponse>> => {
    return await getBase<ResourceResponse>(
        `${GET_RESOURCE_URL}/${id}`,
        "getResource"
    );
};

const getProfile = async (
    id: string
): Promise<FailableResponse<ProfileInfo>> => {
    return await getBase<ProfileInfo>(`${GET_USER_URL}/${id}`, "getProfile");
};

const getBase = async <T>(
    url: string,
    caller: string
): Promise<FailableResponse<T>> => {
    return await baseApi.sendReceiveBase<T>(
        url,
        `PostApi.${caller}`,
        HttpMethod.GET
    );
};

const setPostLike = async (
    id: string,
    _value: boolean,
    type: PostType
): Promise<FailableResponse<undefined>> => {
    return await baseApi.sendReceiveBase<undefined>(
        `${POST_LIKE_URL}/${id}`,
        "PostApi.likePost",
        HttpMethod.POST,
        {
            postType: getRequestPostType(type),
        }
    );
};

const setPostSave = async (
    id: string,
    _value: boolean,
    type: PostType
): Promise<FailableResponse<undefined>> => {
    return await baseApi.sendReceiveBase<undefined>(
        `${POST_SAVE_URL}/${id}`,
        "PostApi.setPostSave",
        HttpMethod.POST,
        {
            submissionType: getRequestPostType(type),
        }
    );
};

const getComments = async (
    postId: string
): Promise<FailableResponse<CommentResponse[]>> => {
    return await getBase<CommentResponse[]>(
        `${GET_COMMENTS_URL}/${postId}`,
        "getComments"
    );
};

const reportPost = async (
    postId: string,
    reportMessage: string,
    type: PostType
): Promise<FailableResponse<undefined>> => {
    return await baseApi.sendReceiveBase<undefined>(
        `${POST_REPORT_URL}/${postId}`,
        "PostApi.reportPost",
        HttpMethod.POST,
        {
            postType: getRequestPostType(type),
            reason: reportMessage,
        }
    );
};

const sendComment = async (
    information: CommentInformation,
    isEdit: boolean = false
): Promise<FailableResponse<undefined>> => {
    const formData = new FormData();

    formData.append("Rating", information.rating.toString());
    formData.append("PostType", getRequestPostType(information.postType));
    if (information.comment != null) {
        formData.append("Comment", information.comment);
    }
    if (information.image != null) {
        formData.append("Image", {
            name: `upload.${information.image.extension}`,
            uri: information.image.uri,
            type: mime.lookup(information.image.extension),
        } as any);
    }
    if (information.previousImageId != null) {
        formData.append("ExistingImage", information.previousImageId);
    }

    return await baseApi.sendReceiveBase<undefined>(
        `${POST_PUT_DELETE_COMMENT_URL}/${information.postId}`,
        "PostApi.sendComment",
        isEdit ? HttpMethod.PUT : HttpMethod.POST,
        formData,
        {
            contentType: "multipart/form-data",
            needJsonBody: false,
        }
    );
};

const deleteComment = async (
    postId: string,
    postType: PostType
): Promise<FailableResponse<undefined>> => {
    return await baseApi.sendReceiveBase<undefined>(
        `${POST_PUT_DELETE_COMMENT_URL}/${postId}`,
        "PostApi.deleteComment",
        HttpMethod.DELETE,
        {
            postId,
            postType: getRequestPostType(postType),
        }
    );
};

const postApi = {
    uploadTip,
    uploadRecipe,
    getPostList,
    getPost,
    getResource,
    getProfile,
    setPostLike,
    setPostSave,
    getComments,
    reportPost,
    sendComment,
    deleteComment,
};

export default postApi;

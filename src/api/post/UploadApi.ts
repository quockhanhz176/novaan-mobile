import BaseApi from "../BaseApi";
import type UploadRecipeInformation from "./types/UploadRecipeInformation";
import { type EditRecipeInformation } from "./types/UploadRecipeInformation";
import { type UploadResponse } from "./types/UploadResponse";
import mime from "react-native-mime-types";

const baseApi = new BaseApi();

const UPLOAD_RECIPE_URL_V2 = "content/upload/recipe/v2";
const UPLOAD_TIP_URL_V2 = "content/upload/tips/v2";
const EDIT_RECIPE_URL = "content/edit/recipe/";
const EDIT_TIP_URL = "content/edit/tips/";

interface VideoInfo {
    videoUrl: string;
    videoExtension?: string;
}

interface ThumbnailInfo {
    thumbnailUrl: string;
    thumbnailExtension?: string;
}

const createUploadTipPayload = (
    title: string,
    description: string,
    video: VideoInfo,
    thumbnail: ThumbnailInfo
): FormData => {
    const { videoUrl, videoExtension } = video;
    const { thumbnailUrl, thumbnailExtension } = thumbnail;

    const formData = new FormData();
    const payload = {
        title,
        description,
    };
    formData.append("Data", JSON.stringify(payload));

    if (videoExtension == null || thumbnailExtension == null) {
        return formData;
    }

    formData.append("Video", {
        name: `upload.${videoExtension}`,
        uri: videoUrl,
        type: `video/${videoExtension}`,
    } as any);
    formData.append("Thumbnail", {
        name: `upload.${thumbnailExtension}`,
        uri: thumbnailUrl,
        type: `video/${thumbnailExtension}`,
    } as any);

    return formData;
};

const createEditTipPayload = (
    title: string,
    description: string,
    video: VideoInfo,
    thumbnail: ThumbnailInfo
): FormData => {
    const { videoUrl, videoExtension } = video;
    const { thumbnailUrl, thumbnailExtension } = thumbnail;

    const formData = new FormData();
    const payload = {
        title,
        description,
        video: videoUrl,
        thumbnail: thumbnailUrl,
    };
    formData.append("Data", JSON.stringify(payload));

    // User doesn't want to update video
    if (videoExtension == null || thumbnailExtension == null) {
        return formData;
    }

    formData.append("Video", {
        name: `upload.${videoExtension}`,
        uri: videoUrl,
        type: `video/${videoExtension}`,
    } as any);

    formData.append("Thumbnail", {
        name: `upload.${thumbnailExtension}`,
        uri: thumbnailUrl,
        type: `video/${thumbnailExtension}`,
    } as any);

    return formData;
};

interface InstrImage {
    step: number;
    name: string;
    uri: string;
    type: string | boolean;
}

const createEditRecipePayload = (
    information: EditRecipeInformation
): FormData => {
    const formData = new FormData();
    const {
        title,
        description,
        difficulty,
        portionType,
        portionQuantity,
        prepTime,
        cookTime,
        instructions,
        ingredients,
        videoUri,
        videoExtension,
        thumbnailUri,
        thumbnailExtension,
        diets,
        mealTypes,
        cuisines,
        allergens,
    } = information;

    const instructionImages: InstrImage[] = [];

    const payload = {
        title,
        description,
        difficulty,
        portionType,
        portionQuantity,
        prepTime,
        cookTime,
        instructions: instructions.map((instruction, index) => {
            const { step, description, image } = instruction;

            // Delete instruction image
            if (image == null) {
                return {
                    step,
                    description,
                    image: undefined,
                };
            }

            // Retain instruction image
            if (image.extension === "") {
                return { step, description, video: image.uri };
            }

            // Replace instruction image
            else {
                instructionImages.push({
                    step: index,
                    name: `upload.${image.extension}`,
                    uri: image.uri,
                    type: mime.lookup(image.extension),
                });
            }

            return {
                step,
                description,
            };
        }),
        ingredients,
        video: videoUri,
        thumbnail: thumbnailUri,
        diets,
        mealTypes,
        cuisines,
        allergens,
    };

    formData.append("Data", JSON.stringify(payload));

    console.log("Data", JSON.stringify(payload));

    if (videoExtension != null) {
        formData.append("Video", {
            name: `upload.${videoExtension}`,
            uri: videoUri,
            type: `video/${videoExtension}`,
        } as any);
    }

    if (thumbnailExtension != null) {
        formData.append("Thumbnail", {
            name: `upload.${thumbnailExtension}`,
            uri: thumbnailUri,
            type: `video/${thumbnailExtension}`,
        } as any);
    }

    instructionImages.forEach(({ step, name, uri, type }: InstrImage) => {
        formData.append(`Image_${step}`, { name, uri, type } as any);
    });

    return formData;
};

const createUploadRecipePayload = (
    information: UploadRecipeInformation
): FormData => {
    const formData = new FormData();
    const {
        title,
        description,
        difficulty,
        portionType,
        portionQuantity,
        prepTime,
        cookTime,
        instructions,
        ingredients,
        videoUri,
        videoExtension,
        thumbnailUri,
        thumbnailExtension,
        diets,
        mealTypes,
        cuisines,
        allergens,
    } = information;

    const instructionImages: InstrImage[] = [];

    const payload = {
        title,
        description,
        difficulty,
        portionType,
        portionQuantity,
        prepTime,
        cookTime,
        instructions: instructions.map((instruction, index) => {
            const { step, description, image } = instruction;
            if (image != null) {
                instructionImages.push({
                    step: index,
                    name: `upload.${image.extension}`,
                    uri: image.uri,
                    type: mime.lookup(image.extension),
                });
            }
            return {
                step,
                description,
            };
        }),
        ingredients,
        diets,
        mealTypes,
        cuisines,
        allergens,
    };

    formData.append("Data", JSON.stringify(payload));
    formData.append("Video", {
        name: `upload.${videoExtension}`,
        uri: videoUri,
        type: `video/${videoExtension}`,
    } as any);
    formData.append("Thumbnail", {
        name: `upload.${thumbnailExtension}`,
        uri: thumbnailUri,
        type: `video/${thumbnailExtension}`,
    } as any);
    instructionImages.forEach(({ step, name, uri, type }: InstrImage) => {
        formData.append(`Image_${step}`, { name, uri, type } as any);
    });

    return formData;
};

const uploadTipV2 = async (
    title: string,
    description: string,
    video: VideoInfo,
    thumbnail: ThumbnailInfo
): Promise<UploadResponse> => {
    const payload = createUploadTipPayload(
        title,
        description,
        video,
        thumbnail
    );
    const response = await baseApi.post<FormData>(UPLOAD_TIP_URL_V2, payload, {
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

const uploadRecipeV2 = async (
    information: UploadRecipeInformation
): Promise<UploadResponse> => {
    const payload = createUploadRecipePayload(information);
    const response = await baseApi.post<FormData>(
        UPLOAD_RECIPE_URL_V2,
        payload,
        {
            timeout: 30000,
            authorizationRequired: true,
            contentType: "multipart/form-data",
            needJsonBody: false,
        }
    );

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

const editTip = async (
    postId: string,
    title: string,
    description: string,
    video: VideoInfo,
    thumbnail: ThumbnailInfo
): Promise<UploadResponse> => {
    const payload = createEditTipPayload(title, description, video, thumbnail);
    const response = await baseApi.put<FormData>(
        `${EDIT_TIP_URL}${postId}`,
        payload,
        {
            timeout: 30000,
            authorizationRequired: true,
            contentType: "multipart/form-data",
            needJsonBody: false,
        }
    );

    console.log("PostApi.editTip - response: " + JSON.stringify(response));

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

const editRecipe = async (
    postId: string,
    information: EditRecipeInformation
): Promise<UploadResponse> => {
    const payload = createEditRecipePayload(information);

    console.log(`${EDIT_RECIPE_URL}${postId}`);

    const response = await baseApi.put<FormData>(
        `${EDIT_RECIPE_URL}${postId}`,
        payload,
        {
            timeout: 30000,
            authorizationRequired: true,
            contentType: "multipart/form-data",
            needJsonBody: false,
        }
    );

    console.log("PostApi.editRecipe - response: " + JSON.stringify(response));

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

export default { uploadRecipeV2, uploadTipV2, editTip, editRecipe };

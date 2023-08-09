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

const createUploadTipPayload = (
    title: string,
    description: string,
    videoUri: string,
    extension: string
): FormData => {
    const formData = new FormData();
    const payload = {
        title,
        description,
    };
    formData.append("Data", JSON.stringify(payload));

    if (extension == null) {
        return formData;
    }

    formData.append("Video", {
        name: `upload.${extension}`,
        uri: videoUri,
        type: `video/${extension}`,
    } as any);

    return formData;
};

const createEditTipPayload = (
    title: string,
    description: string,
    videoUri: string,
    extension?: string
): FormData => {
    const formData = new FormData();
    const payload = {
        title,
        description,
        video: videoUri,
    };
    formData.append("Data", JSON.stringify(payload));

    // User doesn't want to update video
    if (extension == null) {
        return formData;
    }

    formData.append("Video", {
        name: `upload.${extension}`,
        uri: videoUri,
        type: `video/${extension}`,
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
    };

    formData.append("Data", JSON.stringify(payload));

    instructionImages.forEach(({ step, name, uri, type }: InstrImage) => {
        formData.append(`Image_${step}`, { name, uri, type } as any);
    });

    if (videoExtension == null) {
        return formData;
    }

    formData.append("Video", {
        name: `upload.${videoExtension}`,
        uri: videoUri,
        type: `video/${videoExtension}`,
    } as any);

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
    } = information;

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
                formData.append(`Image_${index}`, {
                    name: `upload.${image.extension}`,
                    uri: image.uri,
                    type: mime.lookup(image.extension),
                } as any);
            }
            return {
                step,
                description,
            };
        }),
        ingredients,
    };

    formData.append("Data", JSON.stringify(payload));
    formData.append("Video", {
        name: `upload.${videoExtension}`,
        uri: videoUri,
        type: `video/${videoExtension}`,
    } as any);

    return formData;
};

const uploadTipV2 = async (
    title: string,
    description: string,
    videoUri: string,
    extension: string
): Promise<UploadResponse> => {
    const payload = createUploadTipPayload(
        title,
        description,
        videoUri,
        extension
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
    videoUri: string,
    extension?: string
): Promise<UploadResponse> => {
    const payload = createEditTipPayload(
        title,
        description,
        videoUri,
        extension
    );
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

const editRecipe = async (
    postId: string,
    information: EditRecipeInformation
): Promise<UploadResponse> => {
    const payload = createEditRecipePayload(information);
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

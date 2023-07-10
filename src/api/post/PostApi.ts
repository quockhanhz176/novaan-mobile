import { capitalizeFirstLetter } from "@/common/utils";
import BaseApi from "../BaseApi";
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

// upload
const UPLOAD_RECIPE_URL = "content/upload/recipe";
const UPLOAD_TIP_URL = "content/upload/tips";
// download
const POST_LIST_URL = "content/posts";
const GET_RECIPE_URL = "content/post/recipe";
const GET_TIP_URL = "content/post/tip";
const GET_RESOURCE_URL = "content/download";

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
    const response = await baseApi.get(POST_LIST_URL, {
        timeout: 3000,
        authorizationRequired: true,
    });
    console.log(`PostApi.getPostList - response: ${JSON.stringify(response)}`);
    const body = await response.json();
    console.log(`PostApi.getPostList - body: ${JSON.stringify(body)}`);

    if (!response.ok) {
        const code: number = body.code ?? -1;
        return {
            success: false,
            code,
        };
    }

    return {
        success: true,
        value: body,
    };
};

const getPost = async (
    id: string,
    type: PostResponse["type"]
): Promise<FailableResponse<PostResponse>> => {
    const url =
        type === "tip" ? `${GET_TIP_URL}/${id}` : `${GET_RECIPE_URL}/${id}`;
    const response = await baseApi.get(url, {
        timeout: 3000,
        authorizationRequired: true,
    });
    console.log(`PostApi.getPost - response: ${JSON.stringify(response)}`);
    const body = await response.json();
    console.log(`PostApi.getPost - body: ${JSON.stringify(body)}`);

    if (!response.ok) {
        const code: number = body.code ?? -1;
        return {
            success: false,
            code,
        };
    }

    return {
        success: true,
        value: body,
    };
};

const getResource = async (
    id: string
): Promise<FailableResponse<ResourceResponse>> => {
    const response = await baseApi.get(`${GET_RESOURCE_URL}/${id}`, {
        timeout: 3000,
        authorizationRequired: true,
    });
    console.log(`PostApi.getResource - response: ${JSON.stringify(response)}`);
    const body = await response.json();
    console.log(`PostApi.getResource - body: ${JSON.stringify(body)}`);

    if (!response.ok) {
        const code: number = body.code ?? -1;
        return {
            success: false,
            code,
        };
    }

    return {
        success: true,
        value: body,
    };
};

const postApi = {
    uploadTip,
    uploadRecipe,
    getPostList,
    getPost,
    getResource,
};

export default postApi;

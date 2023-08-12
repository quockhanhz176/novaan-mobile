import {
    CREATE_RECIPE_DESCRIPTION_REQUIRED_ERROR,
    CREATE_RECIPE_DIFFICULTY_MISSING,
    CREATE_RECIPE_FAILED,
    CREATE_RECIPE_FAILED_SECONDARY,
    CREATE_RECIPE_INVALID_ERROR_TITLE,
    CREATE_RECIPE_NO_INGREDIENT_ERROR,
    CREATE_RECIPE_NO_INSTRUCTION_ERROR,
    CREATE_RECIPE_PORTION_QUALITY_OUT_OF_RANGE_ERROR,
    CREATE_RECIPE_PORTION_TYPE_MISSING,
    CREATE_RECIPE_SUCCESS,
    CREATE_RECIPE_TITLE_REQUIRED_ERROR,
    CREATE_RECIPE_VIDEO_REQUIRED_ERROR,
    EDIT_RECIPE_FAILED,
    EDIT_RECIPE_SUCCESS,
} from "@/common/strings";
import { Alert } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import type RecipeSubmission from "../types/RecipeSubmission";
import portionTypeItems from "../types/PortionTypeItems";
import difficultyItems from "../types/DifficultyItems";
import {
    type ValidationResult,
    compressVideo,
    invalidResponse,
} from "../../common/commonServices";
import type RecipeTime from "../types/RecipeTime";
import {
    type EditRecipeInformation,
    type InstructionInformation,
} from "@/api/post/types/UploadRecipeInformation";
import { getUrlExtension } from "@/common/utils";
import UploadApi from "@/api/post/UploadApi";
import { type UploadResponse } from "@/api/post/types/UploadResponse";
import { type PreferenceObj } from "../types/PreferenceObj";
import { getUserIdFromToken } from "@/api/common/utils/TokenUtils";
import { getUserRecipesUrl } from "@/api/profile/ProfileApi";
import { mutate } from "swr";

const validateRecipeSubmission = ({
    title,
    description,
    video,
    thumbnail,
    difficulty,
    portionQuantity,
    portionType,
    instructions,
    ingredients,
}: RecipeSubmission): ValidationResult => {
    if (title === "") {
        return invalidResponse(CREATE_RECIPE_TITLE_REQUIRED_ERROR);
    }

    if (description.length === 0) {
        return invalidResponse(CREATE_RECIPE_DESCRIPTION_REQUIRED_ERROR);
    }

    if (video == null) {
        return invalidResponse(CREATE_RECIPE_VIDEO_REQUIRED_ERROR);
    }

    // If video presents, so should the thumbnail be
    if (thumbnail == null) {
        return invalidResponse(CREATE_RECIPE_VIDEO_REQUIRED_ERROR);
    }

    // If video presents, so should the thumbnail be
    if (thumbnail == null) {
        return invalidResponse(CREATE_RECIPE_VIDEO_REQUIRED_ERROR);
    }

    if (portionQuantity <= 0) {
        return invalidResponse(
            CREATE_RECIPE_PORTION_QUALITY_OUT_OF_RANGE_ERROR
        );
    }

    const portionTypeValid =
        portionTypeItems.findIndex(
            (portionItem) => portionItem.value === portionType
        ) !== -1;
    if (!portionTypeValid) {
        return invalidResponse(CREATE_RECIPE_PORTION_TYPE_MISSING);
    }

    const difficultyValid =
        difficultyItems.findIndex(
            (difficultyItem) => difficultyItem.value === difficulty
        ) !== -1;
    if (!difficultyValid) {
        return invalidResponse(CREATE_RECIPE_DIFFICULTY_MISSING);
    }

    if (ingredients.length <= 0) {
        return invalidResponse(CREATE_RECIPE_NO_INGREDIENT_ERROR);
    }

    if (instructions.length <= 0) {
        return invalidResponse(CREATE_RECIPE_NO_INSTRUCTION_ERROR);
    }

    return { valid: true };
};

const validateRecipeEdit = ({
    title,
    description,
    difficulty,
    portionQuantity,
    portionType,
    instructions,
    ingredients,
}: RecipeSubmission): ValidationResult => {
    if (title === "") {
        return invalidResponse(CREATE_RECIPE_TITLE_REQUIRED_ERROR);
    }

    if (description.length === 0) {
        return invalidResponse(CREATE_RECIPE_DESCRIPTION_REQUIRED_ERROR);
    }

    if (portionQuantity <= 0) {
        return invalidResponse(
            CREATE_RECIPE_PORTION_QUALITY_OUT_OF_RANGE_ERROR
        );
    }

    const portionTypeValid =
        portionTypeItems.findIndex(
            (portionItem) => portionItem.value === portionType
        ) !== -1;
    if (!portionTypeValid) {
        return invalidResponse(CREATE_RECIPE_PORTION_TYPE_MISSING);
    }

    const difficultyValid =
        difficultyItems.findIndex(
            (difficultyItem) => difficultyItem.value === difficulty
        ) !== -1;
    if (!difficultyValid) {
        return invalidResponse(CREATE_RECIPE_DIFFICULTY_MISSING);
    }

    if (ingredients.length <= 0) {
        return invalidResponse(CREATE_RECIPE_NO_INGREDIENT_ERROR);
    }

    if (instructions.length <= 0) {
        return invalidResponse(CREATE_RECIPE_NO_INSTRUCTION_ERROR);
    }

    return { valid: true };
};

export const mapPreferenceObjToValue = (from: PreferenceObj): string[] => {
    const result: string[] = [];
    Object.entries(from).forEach(([key, value]) => {
        if (value != null && value) {
            result.push(key);
        }
    });

    return result;
};

export const handleRecipeSubmission = async (
    recipeSubmission: RecipeSubmission,
    onRecipeValid?: () => void
): Promise<void> => {
    const { video, thumbnail } = recipeSubmission;
    const validationResult = validateRecipeSubmission(recipeSubmission);
    if (!validationResult.valid) {
        Alert.alert(
            CREATE_RECIPE_INVALID_ERROR_TITLE,
            validationResult.message
        );
        return;
    }

    onRecipeValid?.();

    if (video == null || video.uri == null) {
        console.error(
            "video or video.uri is null, which is impossible after validation"
        );
        return;
    }

    if (thumbnail == null) {
        console.error(
            "thumbnail video or video.uri is null, which is impossible after validation"
        );
        return;
    }

    try {
        const result = await compressVideo("recipeParams", video.uri);

        if (result === undefined) {
            return;
        }

        const { realVideoPath, videoInfo } = result;

        const getTimeString = (time: RecipeTime): string => {
            const day = Math.floor(time.hour / 24);
            const hour = time.hour % 24;
            const hourText = hour.toLocaleString(undefined, {
                minimumIntegerDigits: 2,
            });
            const minuteText = time.minute.toLocaleString(undefined, {
                minimumIntegerDigits: 2,
            });
            return `${day}.${hourText}:${minuteText}:00`;
        };

        const instructions = recipeSubmission.instructions.map(
            (instruction): InstructionInformation => {
                return {
                    ...instruction,
                    image:
                        instruction.imageUri !== undefined
                            ? {
                                  uri: instruction.imageUri,
                                  extension: getUrlExtension(
                                      instruction.imageUri
                                  ),
                              }
                            : undefined,
                };
            }
        );
        const uploadResult = await UploadApi.uploadRecipeV2({
            ...recipeSubmission,
            diets: mapPreferenceObjToValue(recipeSubmission.diets),
            mealTypes: mapPreferenceObjToValue(recipeSubmission.mealTypes),
            cuisines: mapPreferenceObjToValue(recipeSubmission.cuisines),
            allergens: mapPreferenceObjToValue(recipeSubmission.allergens),
            videoUri: realVideoPath,
            videoExtension: videoInfo.extension,
            thumbnailUri: thumbnail,
            thumbnailExtension: getUrlExtension(thumbnail),
            instructions,
            cookTime: getTimeString(recipeSubmission.cookTime),
            prepTime: getTimeString(recipeSubmission.prepTime),
        });

        if (!uploadResult.success) {
            throw Error("Upload failed");
        }

        // Revalidate data and navigate back
        const currentUserId = await getUserIdFromToken();
        await mutate(
            // Only creator can edit their own post so it's safe to assume currentUserId === postInfo.creator.userId
            (key) =>
                Array.isArray(key) &&
                key[0] === getUserRecipesUrl(currentUserId)
        );

        // Notify the user when upload is success
        Toast.show({
            type: "success",
            text1: CREATE_RECIPE_SUCCESS,
        });
    } catch (e) {
        // Notify the user when it fails
        Toast.show({
            type: "error",
            text1: CREATE_RECIPE_FAILED,
            text2: CREATE_RECIPE_FAILED_SECONDARY,
        });
        console.error(e.message);
    }
};

export const handleRecipeEdit = async (
    postId: string,
    videoUrl: string,
    thumbnailUrl: string,
    recipeSubmission: RecipeSubmission,
    onRecipeValid?: () => void
): Promise<void> => {
    const validationResult = validateRecipeEdit(recipeSubmission);
    if (!validationResult.valid) {
        Alert.alert(
            CREATE_RECIPE_INVALID_ERROR_TITLE,
            validationResult.message
        );
        return;
    }

    // Should not be possible
    if (recipeSubmission.thumbnail == null) {
        Alert.alert(
            CREATE_RECIPE_INVALID_ERROR_TITLE,
            validationResult.message
        );
        return;
    }

    onRecipeValid?.();

    const getTimeString = (time: RecipeTime): string => {
        const day = Math.floor(time.hour / 24);
        const hour = time.hour % 24;
        const hourText = hour.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
        });
        const minuteText = time.minute.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
        });
        return `${day}.${hourText}:${minuteText}:00`;
    };

    const instructions = recipeSubmission.instructions.map(
        (instruction): InstructionInformation => {
            return {
                ...instruction,
                image:
                    instruction.imageUri !== undefined
                        ? {
                              uri: instruction.imageUri,
                              extension: getUrlExtension(instruction.imageUri),
                          }
                        : undefined,
            };
        }
    );

    const payload: EditRecipeInformation = {
        ...recipeSubmission,
        diets: mapPreferenceObjToValue(recipeSubmission.diets),
        mealTypes: mapPreferenceObjToValue(recipeSubmission.mealTypes),
        cuisines: mapPreferenceObjToValue(recipeSubmission.cuisines),
        allergens: mapPreferenceObjToValue(recipeSubmission.allergens),
        instructions,
        cookTime: getTimeString(recipeSubmission.cookTime),
        prepTime: getTimeString(recipeSubmission.prepTime),
        videoUri: "",
        thumbnailUri: "",
    };

    const { video } = recipeSubmission;
    try {
        let uploadResult: UploadResponse;

        // Keep current video
        if (video == null || video.uri == null) {
            payload.videoUri = videoUrl;
            payload.thumbnailUri = thumbnailUrl;
            uploadResult = await UploadApi.editRecipe(postId, payload);
        }
        // Replace current video with new video
        else {
            const result = await compressVideo("recipeParams", video.uri);
            if (result === undefined) {
                return;
            }

            const { realVideoPath, videoInfo } = result;
            payload.videoUri = realVideoPath;
            payload.videoExtension = videoInfo.extension;
            payload.thumbnailUri = recipeSubmission.thumbnail;
            payload.thumbnailExtension = getUrlExtension(
                recipeSubmission.thumbnail
            );
            uploadResult = await UploadApi.editRecipe(postId, payload);
        }

        if (!uploadResult.success) {
            throw Error("Upload failed");
        }

        // Revalidate data and navigate back
        const currentUserId = await getUserIdFromToken();
        await mutate(
            // Only creator can edit their own post so it's safe to assume currentUserId === postInfo.creator.userId
            (key) =>
                Array.isArray(key) &&
                key[0] === getUserRecipesUrl(currentUserId)
        );

        // Notify the user when upload is success
        Toast.show({
            type: "success",
            text1: EDIT_RECIPE_SUCCESS,
        });
    } catch (e) {
        console.log(e);

        // Notify the user when it fails
        Toast.show({
            type: "error",
            text1: EDIT_RECIPE_FAILED,
            text2: CREATE_RECIPE_FAILED_SECONDARY,
        });
    }
};

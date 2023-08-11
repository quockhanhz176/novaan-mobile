import {
    CREATE_TIP_DESCRIPTION_REQUIRED_ERROR,
    CREATE_TIP_FAILED,
    CREATE_TIP_FAILED_SECONDARY,
    CREATE_TIP_INVALID_ERROR_TITLE,
    CREATE_TIP_SUCCESS,
    CREATE_TIP_TITLE_REQUIRED_ERROR,
    CREATE_TIP_VIDEO_REQUIRED_ERROR,
    EDIT_TIP_SUCCESS,
} from "@/common/strings";
import type TipSubmission from "../types/TipSubmission";
import { Alert } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import {
    type ValidationResult,
    invalidResponse,
    compressVideo,
} from "../../common/commonServices";
import UploadApi from "@/api/post/UploadApi";
import { type UploadResponse } from "@/api/post/types/UploadResponse";
import { getUrlExtension } from "@/common/utils";

const validateTipSubmission = ({
    title,
    description,
    video,
}: TipSubmission): ValidationResult => {
    if (title === "") {
        return invalidResponse(CREATE_TIP_TITLE_REQUIRED_ERROR);
    }

    if (description.length === 0) {
        return invalidResponse(CREATE_TIP_DESCRIPTION_REQUIRED_ERROR);
    }

    if (video == null) {
        return invalidResponse(CREATE_TIP_VIDEO_REQUIRED_ERROR);
    }

    return { valid: true };
};

const validateTipEdit = ({
    title,
    description,
    video,
}: TipSubmission): ValidationResult => {
    if (title === "") {
        return invalidResponse(CREATE_TIP_TITLE_REQUIRED_ERROR);
    }

    if (description.length === 0) {
        return invalidResponse(CREATE_TIP_DESCRIPTION_REQUIRED_ERROR);
    }

    return { valid: true };
};

export const handleTipSubmission = async (
    tipSubmission: TipSubmission,
    onTipValid?: () => void
): Promise<void> => {
    const { title, video, description, thumbnail } = tipSubmission;
    const validationResult = validateTipSubmission(tipSubmission);
    if (!validationResult.valid) {
        Alert.alert(CREATE_TIP_INVALID_ERROR_TITLE, validationResult.message);
        return;
    }

    onTipValid?.();

    if (video == null || video.uri == null) {
        console.error(
            "video or video.uri is null, which is impossible after validation"
        );
        return;
    }

    try {
        const result = await compressVideo("tipTDVParams", video.uri);

        if (result === undefined) {
            return;
        }

        const { realVideoPath, videoInfo } = result;

        const uploadResult = await UploadApi.uploadTipV2(
            title,
            description,
            { videoUrl: realVideoPath, videoExtension: videoInfo.extension },
            {
                thumbnailUrl: thumbnail,
                thumbnailExtension: getUrlExtension(thumbnail),
            }
        );

        if (!uploadResult.success) {
            throw Error("Upload failed");
        }

        // Notify the user when upload is success
        Toast.show({
            type: "success",
            text1: CREATE_TIP_SUCCESS,
        });
    } catch (e) {
        // Notify the user when it fails
        Toast.show({
            type: "error",
            text1: CREATE_TIP_FAILED,
            text2: CREATE_TIP_FAILED_SECONDARY,
        });
        console.error(e.message);
    }
};

export const handleTipEdit = async (
    postId: string,
    videoUrl: string,
    thumbnailUrl: string,
    tipSubmission: TipSubmission,
    onTipValid?: () => void
): Promise<void> => {
    const validationResult = validateTipEdit(tipSubmission);
    if (!validationResult.valid) {
        Alert.alert(CREATE_TIP_INVALID_ERROR_TITLE, validationResult.message);
        return;
    }

    onTipValid?.();

    const { title, description, video, thumbnail } = tipSubmission;

    try {
        let uploadResult: UploadResponse;
        // Retain current video (also mean same thumbnail)
        if (video == null && thumbnail == null) {
            uploadResult = await UploadApi.editTip(
                postId,
                title,
                description,
                { videoUrl },
                { thumbnailUrl }
            );
        }
        // Replace current video with new video
        else {
            const result = await compressVideo(
                "tipTDVParams",
                video.uri as string
            );

            if (result === undefined) {
                return;
            }

            const { realVideoPath, videoInfo } = result;
            uploadResult = await UploadApi.editTip(
                postId,
                title,
                description,
                {
                    videoUrl: realVideoPath,
                    videoExtension: videoInfo.extension,
                },
                {
                    thumbnailUrl: thumbnail,
                    thumbnailExtension: getUrlExtension(thumbnail),
                }
            );
        }

        if (!uploadResult.success) {
            throw Error("Upload failed");
        }

        // Notify the user when upload is success
        Toast.show({
            type: "success",
            text1: EDIT_TIP_SUCCESS,
        });
    } catch {
        // Notify the user when it fails
        Toast.show({
            type: "error",
            text1: CREATE_TIP_FAILED,
            text2: CREATE_TIP_FAILED_SECONDARY,
        });
    }
};

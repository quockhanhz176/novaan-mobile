import {
    COMMON_UNKNOWN_ERROR,
    CREATE_TIP_DESCRIPTION_REQUIRED_ERROR,
    CREATE_TIP_DESCRIPTION_TOO_SHORT_ERROR,
    CREATE_TIP_INVALID_ERROR_TITLE,
    CREATE_TIP_TITLE_REQUIRED_ERROR,
    CREATE_TIP_VIDEO_REQUIRED_ERROR,
    CREATE_TIP_VIDEO_WRONG_LENGTH_ERROR,
} from "@/common/strings";
import type TipSubmission from "../types/TipSubmission";
import { Alert } from "react-native";
import { Video } from "react-native-compressor";
import PostApi from "@/api/post/PostApi";
import { getThumbnailAsync } from "expo-video-thumbnails";
import { type Asset, launchImageLibrary } from "react-native-image-picker";

interface ValidationResult {
    valid: boolean;
    message?: string;
}

const VIDEO_LENGTH_UPPER_LIMIT = 120;
const DESCRIPTION_LENGTH_LOWER_LIMIT = 30;
// const VIDEO_SIZE_UPPER_LIMIT = 20 * 1024 * 1024;

const validateTipSubmission = ({
    title,
    description,
    video,
}: TipSubmission): ValidationResult => {
    const invalidResponse = (response: string): ValidationResult => {
        return {
            valid: false,
            message: response,
        };
    };

    if (title === "") {
        return invalidResponse(CREATE_TIP_TITLE_REQUIRED_ERROR);
    }

    if (description.length === 0) {
        return invalidResponse(CREATE_TIP_DESCRIPTION_REQUIRED_ERROR);
    }

    if (description.length < DESCRIPTION_LENGTH_LOWER_LIMIT) {
        return invalidResponse(CREATE_TIP_DESCRIPTION_TOO_SHORT_ERROR);
    }

    if (video == null) {
        return invalidResponse(CREATE_TIP_VIDEO_REQUIRED_ERROR);
    }

    if (video.duration == null || video.duration === 0) {
        return invalidResponse(COMMON_UNKNOWN_ERROR);
    }

    if (video.fileSize == null) {
        return invalidResponse(COMMON_UNKNOWN_ERROR);
    }

    if (video.duration > VIDEO_LENGTH_UPPER_LIMIT) {
        return invalidResponse(CREATE_TIP_VIDEO_WRONG_LENGTH_ERROR);
    }

    return { valid: true };
};

export const handleTipSubmission = async (
    tipSubmission: TipSubmission,
    onTipValid?: () => void
): Promise<void> => {
    const { title, video, description } = tipSubmission;
    const validationResult = validateTipSubmission(tipSubmission);
    if (!validationResult.valid) {
        Alert.alert(CREATE_TIP_INVALID_ERROR_TITLE, validationResult.message);
        return;
    }

    onTipValid?.();

    try {
        if (video == null || video.uri == null) {
            console.error(
                "video or video.uri is null, which is impossible after validation"
            );
            return;
        }

        // compress video
        const videoUri = await Video.compress(
            video.uri,
            {
                compressionMethod: "auto",
            },
            (progress: number): void => {
                console.log(
                    "createTipService.handleTipSubmission - compression progress: " +
                        progress.toString()
                );
            }
        );

        await PostApi.uploadTip(title, description, videoUri);
    } catch (e) {
        console.trace(e);
    }
};

export const pickVideoAndThumbnail = async (
    onVideoPicked: (asset: Asset) => void,
    onThumbNailPicked: (uri: string) => void
): Promise<void> => {
    try {
        // pick video
        const videoResponse = await launchImageLibrary({
            mediaType: "video",
            includeBase64: true,
        });
        if (videoResponse.didCancel === true) {
            return;
        }
        const asset = videoResponse.assets?.[0];
        if (asset == null) {
            console.error("impossible!");
            return;
        }
        onVideoPicked(asset);

        // pick thumbnail
        if (asset.uri == null) {
            console.error("uri not found");
            return;
        }
        const timeStamp =
            asset.duration != null && asset.duration > 3000 ? 3000 : 0;
        const { uri } = await getThumbnailAsync(asset.uri, {
            time: timeStamp,
        });
        onThumbNailPicked(uri);
    } catch (error) {
        console.error(`fail: ${String(error)}`);
    }
};

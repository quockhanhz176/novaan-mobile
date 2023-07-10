import { getThumbnailAsync } from "expo-video-thumbnails";
import { Video, getRealPath, getVideoMetaData } from "react-native-compressor";
import { type Asset, launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import TDVParamTypes, { type TDVParams } from "./types/TDVParams";

export interface VideoInfo {
    duration: number;
    width: number;
    height: number;
    extension: string;
    size: number;
}

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

export const invalidResponse = (response: string): ValidationResult => {
    return {
        valid: false,
        message: response,
    };
};

const VIDEO_LENGTH_UPPER_LIMIT = 120;
const VIDEO_SIZE_UPPER_LIMIT = 20 * 1024; // 20MB

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

export const validateCompressedVideo = (
    fileInfo: VideoInfo,
    messageSuite: TDVParams<any>["messages"]
): ValidationResult => {
    // Validate file size
    if (fileInfo.size > VIDEO_SIZE_UPPER_LIMIT) {
        return invalidResponse(messageSuite.wrongFileSizeError);
    }

    // Validate duration
    if (fileInfo.duration > VIDEO_LENGTH_UPPER_LIMIT) {
        return invalidResponse(messageSuite.wrongFileLengthError);
    }

    // TODO: Temporary commentted out to test the system more easily
    // const getResolution(a: number, b: number): [number, number] => {
    //     const getGCD = (a: number, b: number): number => {
    //         if(b === 0) {
    //             return a;
    //         }
    //         return getGCD(b, a % b)
    //     }

    //     const gcd = getGCD(a, b);
    //     return [a / gcd, b / gcd];
    // }

    // // Validate resolution - Force 9:16 vertical video
    // const videoResolution = getResolution(fileInfo.width, fileInfo.height)
    // if(videoResolution[0] !== 9 || videoResolution[1] !== 16) {
    //     return invalidResponse(CREATE_TIP_VIDEO_WRONG_RESOLUTION);
    // }

    return { valid: true };
};

export const compressVideo = async (
    suite: keyof typeof TDVParamTypes,
    uri: string
): Promise<{ realVideoPath: string; videoInfo: VideoInfo } | undefined> => {
    // Notify the user that the video is being uploaded
    const messageSuite = TDVParamTypes[suite].messages;
    Toast.show({
        type: "info",
        text1: messageSuite.compressingMessage,
    });

    // Compress video
    const videoUri = await Video.compress(uri, {
        compressionMethod: "auto",
        minimumFileSizeForCompress: 20,
        maxSize: 1280, // HD width
    });

    const realVideoPath = await getRealPath(videoUri, "video");
    const videoInfo = (await getVideoMetaData(realVideoPath)) as VideoInfo;

    const validationResult = validateCompressedVideo(videoInfo, messageSuite);
    if (!validationResult.valid) {
        Toast.show({
            type: "error",
            text1: messageSuite.failMessage,
            text2: validationResult.message,
        });
        return;
    }

    return { realVideoPath, videoInfo };
};

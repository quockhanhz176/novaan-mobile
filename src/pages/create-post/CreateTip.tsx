import React, { useState, type FC } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import WarningAsterisk from "@/components/common/WarningAeterisk";
import * as ImagePicker from "react-native-image-picker";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import {
    CREATE_TIP_THANKS,
    CREATE_TIP_TITLE_PLACEHOLDER,
    CREATE_TIP_MEDIA_LABEL,
    CREATE_TIP_TITLE_LABEL,
    CREATE_TIP_MEDIA_BUTTON_TEXT,
    CREATE_TIP_DESCRIPTION_LABEL,
    CREATE_TIP_DESCRIPTION_PLACEHOLDER,
    CREATE_TIP_TITLE,
    CREATE_TIP_INVALID_ERROR_TITLE,
    CREATE_TIP_TITLE_REQUIRED_ERROR,
    CREATE_TIP_VIDEO_REQUIRED_ERROR,
    COMMON_UNKNOWN_ERROR,
    CREATE_TIP_VIDEO_WRONG_LENGTH_ERROR,
    CREATE_TIP_SUBMIT,
} from "@/common/strings";
import { getThumbnailAsync } from "expo-video-thumbnails";
import { customColors } from "@root/tailwind.config";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type RootStackParamList } from "@root/App";
import { Video } from "react-native-compressor";
import { getInfoAsync } from "expo-file-system";
import PostApi from "@/api/post/PostApi";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultThumbnail = require("@root/assets/default-video.png");
const VIDEO_LENGTH_UPPER_LIMIT = 120;
// const VIDEO_SIZE_UPPER_LIMIT = 20 * 1024 * 1024;

interface CreateTipProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "CreateTip">;
}

type ValidateionResult = { valid: true } | { valid: false; message: string };

const CreateTip: FC<CreateTipProps> = (props: CreateTipProps) => {
    const { navigation } = props;
    const labelClassName = "text-base font-medium uppercase";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState<ImagePicker.Asset | null>();
    const [thumbnailUri, setThumbnailUri] = useState<string | null>();

    const onTitleChange = (text: string): void => {
        setTitle(text);
    };

    const onDescriptionChange = (text: string): void => {
        setDescription(text);
    };

    const navigateBack = (): void => {
        navigation.pop();
    };

    const selectVideo = async (): Promise<void> => {
        try {
            // pick video
            const videoResponse = await ImagePicker.launchImageLibrary({
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
            setVideo(asset);

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
            setThumbnailUri(uri);
        } catch (error) {
            console.error(`fail: ${String(error)}`);
        }
    };

    const validateSubmission = (): ValidateionResult => {
        const response = {
            valid: false,
            message: "",
        };

        if (title === "") {
            response.message = CREATE_TIP_TITLE_REQUIRED_ERROR;
            return response;
        }

        if (video == null) {
            response.message = CREATE_TIP_VIDEO_REQUIRED_ERROR;
            return response;
        }

        if (
            video.duration === null ||
            video.duration === undefined ||
            video.duration === 0
        ) {
            response.message = COMMON_UNKNOWN_ERROR;
            return response;
        }

        if ((video.fileSize ?? "") === "") {
            response.message = COMMON_UNKNOWN_ERROR;
            return response;
        }

        if (video.duration > VIDEO_LENGTH_UPPER_LIMIT) {
            response.message = CREATE_TIP_VIDEO_WRONG_LENGTH_ERROR;
            return response;
        }

        return { valid: true };
    };

    const submit = async (): Promise<void> => {
        const validationResult = validateSubmission();
        if (!validationResult.valid) {
            Alert.alert(
                CREATE_TIP_INVALID_ERROR_TITLE,
                validationResult.message
            );
            return;
        }

        if (video == null || video.uri == null) {
            console.error(
                "video or video.uri is null, which is impossible after validation"
            );
            return;
        }

        // compress video
        const result = await Video.compress(
            video.uri,
            {
                compressionMethod: "auto",
            },
            (progress: number): void => {
                console.log("progress: " + progress.toString());
            }
        );

        console.log(`result: ${result}`);
        const fileInfo = await getInfoAsync(result, { size: true });
        console.log(`initil file size: ${video.fileSize?.toString() ?? "no"}`);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`compressed file size: ${fileInfo.size.toString()}`);

        await PostApi.uploadTip(title, result);
    };

    return (
        <View className="flex-1">
            <View className="h-[55] flex-row justify-between px-1">
                <View className="flex-row space-x-2 items-center">
                    <TouchableOpacity
                        onPress={navigateBack}
                        activeOpacity={0.2}
                        className="h-10 w-10 items-center justify-center"
                    >
                        <IconEvill name="close" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-medium">
                        {CREATE_TIP_TITLE}
                    </Text>
                </View>
            </View>
            <ScrollView>
                <Text className="text-base p-5 bg-ctertiary ">
                    {CREATE_TIP_THANKS}
                </Text>
                <View className="px-3 py-7">
                    <Text className={labelClassName}>
                        {CREATE_TIP_TITLE_LABEL}
                        <WarningAsterisk />
                    </Text>
                    <TextInput
                        onChangeText={onTitleChange}
                        maxLength={55}
                        className="text-xl py-2 border-cgrey-platinum"
                        // classname doesn't work
                        style={{ borderBottomWidth: 1 }}
                        placeholder={CREATE_TIP_TITLE_PLACEHOLDER}
                    />
                    <View className="items-end mt-2">
                        <Text className="text-cgrey-dimGrey text-base">
                            {title.length.toString() + "/55"}
                        </Text>
                    </View>
                    <Text className={labelClassName + " mt-4"}>
                        {CREATE_TIP_MEDIA_LABEL}
                        <WarningAsterisk />
                    </Text>
                    {video == null ? (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={selectVideo}
                            className="h-[380] mt-2 rounded-md border-cprimary-500 bg-ctertiary"
                            style={{ borderWidth: 1.3 }}
                        >
                            <View className="flex-row px-5 justify-center items-center space-x-2 h-full">
                                <IconMaterial
                                    size={60}
                                    name="video-library"
                                    color={customColors.cprimary[500]}
                                />
                                <Text className="w-[200] text-base text-cprimary-500">
                                    {CREATE_TIP_MEDIA_BUTTON_TEXT}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={selectVideo}
                            className="h-[380] mt-2 rounded-md overflow-hidden"
                        >
                            <Image
                                className="h-full w-full"
                                source={
                                    thumbnailUri !== null
                                        ? { uri: thumbnailUri }
                                        : defaultThumbnail
                                }
                            />
                        </TouchableOpacity>
                    )}
                    <Text className={labelClassName + " mt-10"}>
                        {CREATE_TIP_DESCRIPTION_LABEL}
                    </Text>
                    <TextInput
                        onChangeText={onDescriptionChange}
                        textAlignVertical="top"
                        multiline
                        numberOfLines={4}
                        maxLength={500}
                        className="text-base py-2"
                        placeholder={CREATE_TIP_DESCRIPTION_PLACEHOLDER}
                    />
                    <View className="items-end">
                        <Text className="text-cgrey-dimGrey text-base">
                            {description.length.toString() + "/500"}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View
                className="flex-row justify-center items-center border-cgrey-seasalt"
                style={{ borderTopWidth: 2 }}
            >
                <TouchableOpacity
                    className="flex-row space-x-3 items-center rounded-full my-2 px-6 py-2 bg-cprimary-500"
                    onPress={submit}
                >
                    <Text className="text-sm text-white">
                        {CREATE_TIP_SUBMIT}
                    </Text>
                    {/* change to eyeo for previewing */}
                    <IconAnt name="upload" color="white" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateTip;

import React, { useState, type FC, useEffect, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
} from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import WarningAsterisk from "@/common/components/WarningAeterisk";
import type * as ImagePicker from "react-native-image-picker";
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
    CREATE_TIP_SUBMIT,
    EDIT_TIP_TITLE,
    EDIT_RECIPE_PENDING,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    handleTipEdit,
    handleTipSubmission,
} from "./services/createTipService";
import { pickVideoAndThumbnail } from "../common/commonServices";
import { type RootStackParamList } from "@/types/navigation";
import { usePostInfo } from "@/api/post/PostApiHook";
import { type RouteProp } from "@react-navigation/native";
import { useSWRConfig } from "swr";
import { getUserTipsUrl } from "@/api/profile/ProfileApi";
import Toast from "react-native-toast-message";
import { getUserIdFromToken } from "@/api/common/utils/TokenUtils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultThumbnail = require("@root/assets/default-video.png");

interface CreateTipProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "CreateTip">;
    route: RouteProp<RootStackParamList, "CreateTip">;
}

const CreateTip: FC<CreateTipProps> = ({
    navigation,
    route,
}: CreateTipProps) => {
    const labelClassName = "text-base font-medium uppercase";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState<ImagePicker.Asset | null>();
    const [thumbnailUri, setThumbnailUri] = useState<string | null>();

    const { postInfo, fetchPostInfo } = usePostInfo();
    // const { resourceUrl, fetchUrl } = useFetchResourceUrl();

    const { mutate } = useSWRConfig();

    const isEditing = useMemo(() => route.params?.postId != null, [route]);

    useEffect(() => {
        // Fetch initial data if editing
        if (route.params?.postId == null) {
            return;
        }

        void fetchPostInfo({
            postId: route.params.postId,
            postType: "CulinaryTip",
        });
    }, []);

    useEffect(() => {
        if (postInfo === undefined) {
            return;
        }

        setTitle(postInfo.title);
        setDescription(postInfo.description);

        // Pull thumbnail into thumbnailUri
        // void fetchUrl(postInfo.thumbnail)
    }, [postInfo]);

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
        await pickVideoAndThumbnail(setVideo, setThumbnailUri);
    };

    const submit = async (): Promise<void> => {
        if (route.params?.postId == null) {
            await handleTipSubmission(
                { title, description, video, thumbnail: thumbnailUri },
                () => {
                    navigateBack();
                }
            );
        } else {
            if (postInfo == null) {
                return;
            }

            await handleTipEdit(
                postInfo.id,
                postInfo.video,
                postInfo.thumbnail,
                {
                    title,
                    description,
                    video,
                    thumbnail: thumbnailUri,
                },
                () => {
                    Toast.show({ type: "info", text1: EDIT_RECIPE_PENDING });
                    navigateBack();
                }
            );
        }

        // Revalidate user profile created tips
        const currentUserId = await getUserIdFromToken();
        await mutate(
            // Only creator can edit their own post so it's safe to assume currentUserId === postInfo.creator.userId
            (key) =>
                Array.isArray(key) && key[0] === getUserTipsUrl(currentUserId)
        );
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
                        {isEditing ? EDIT_TIP_TITLE : CREATE_TIP_TITLE}
                    </Text>
                </View>
            </View>
            <ScrollView>
                {!isEditing && (
                    <Text className="text-base p-5 bg-ctertiary ">
                        {CREATE_TIP_THANKS}
                    </Text>
                )}
                <View className="px-3 py-7">
                    <Text className={labelClassName}>
                        {CREATE_TIP_TITLE_LABEL}
                        <WarningAsterisk />
                    </Text>
                    <TextInput
                        onChangeText={onTitleChange}
                        value={title}
                        maxLength={55}
                        className="text-xl py-2 border-cgrey-platinum border-b"
                        placeholder={CREATE_TIP_TITLE_PLACEHOLDER}
                    />
                    <View className="items-end mt-2">
                        <Text className="text-cgrey-dim text-base">
                            {title.length.toString() + "/55"}
                        </Text>
                    </View>
                    <Text className={labelClassName + " mt-10"}>
                        {CREATE_TIP_DESCRIPTION_LABEL}
                        <WarningAsterisk />
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={onDescriptionChange}
                        textAlignVertical="top"
                        multiline
                        numberOfLines={4}
                        maxLength={500}
                        className="text-base py-2 first-line:border-cgrey-platinum border-b"
                        placeholder={CREATE_TIP_DESCRIPTION_PLACEHOLDER}
                    />
                    <View className="items-end">
                        <Text className="text-cgrey-dim text-base">
                            {description.length.toString() + "/500"}
                        </Text>
                    </View>
                    <Text className={labelClassName + " mt-10"}>
                        {CREATE_TIP_MEDIA_LABEL}
                        <WarningAsterisk />
                    </Text>
                    {thumbnailUri == null ? (
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
                        {route.params?.postId == null
                            ? CREATE_TIP_SUBMIT
                            : "Chỉnh sửa bài viết"}
                    </Text>
                    {/* change to eyeo for previewing */}
                    <IconAnt name="upload" color="white" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateTip;

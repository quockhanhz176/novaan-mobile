import React, { useState, useRef, type FC } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import IconIon from "react-native-vector-icons/Ionicons";
import { type Asset, launchImageLibrary } from "react-native-image-picker";
import { customColors } from "@root/tailwind.config";
import {
    ADD_COMMENT_DETAIL_PLACEHOLDER,
    ADD_COMMENT_DETAIL_TITLE,
    ADD_COMMENT_EDIT_TITLE,
    ADD_COMMENT_NO_RATING_ERROR,
    ADD_COMMENT_STAR_TITLE,
    ADD_COMMENT_SUBMIT,
    ADD_COMMENT_TITLE,
} from "@/common/strings";
import StarRating from "react-native-star-rating";
import IconLabelButton from "@/common/components/IconLabelButton";
import type PostComment from "../../types/PostComment";
import ResourceImage from "@/common/components/ResourceImage";
import { getUrlExtension } from "@/common/utils";
import { type CommentFormInfo } from "@/api/post/types/CommentInformation";

interface AddEditCommentProps {
    comment?: PostComment;
    onClose: () => void;
    onSubmit: (commentInfo: CommentFormInfo) => void;
}

const AddEditComment: FC<AddEditCommentProps> = ({
    comment,
    onClose,
    onSubmit,
}) => {
    const [rating, setRating] = useState(comment?.rating ?? 0);
    const [detail, setDetail] = useState(comment?.comment ?? "");
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const imageAsset = useRef<Asset | undefined>(undefined);
    const [previousImageId, setPreviousImageId] = useState<string | undefined>(
        comment?.image
    );

    const resetState = (): void => {
        setRating(0);
        setDetail("");
        setImageUri(undefined);
        setPreviousImageId(undefined);
    };

    const onClosePressed = (): void => {
        resetState();
        onClose();
    };

    const submit = async (): Promise<void> => {
        const error = (message: string): void => {
            Alert.alert("", message);
        };

        if (rating === 0) {
            error(ADD_COMMENT_NO_RATING_ERROR);
        }

        onClose();

        const image =
            imageUri == null
                ? undefined
                : { uri: imageUri, extension: getUrlExtension(imageUri) };
        const commentInfo: CommentFormInfo = {
            rating,
            comment: detail,
            image,
            previousImageId,
        };
        onSubmit(commentInfo);
    };

    const selectImage = async (): Promise<void> => {
        const photoResponse = await launchImageLibrary({
            mediaType: "photo",
            includeBase64: true,
        });
        if (photoResponse.didCancel === true) {
            return;
        }
        const asset = photoResponse.assets?.[0];
        if (asset == null) {
            console.error("impossible!");
            return;
        }
        setImageUri(asset.uri);
        imageAsset.current = asset;
    };

    const removeImage = (): void => {
        setImageUri(undefined);
        setPreviousImageId(undefined);
    };

    return (
        <ScrollView
            onTouchEnd={(e) => {
                e.stopPropagation();
            }}
        >
            <View className="h-[58] flex-row items-center justify-between px-1 border-b-2 border-cgrey-platinum">
                <View className="flex-row space-x-2 items-center">
                    <TouchableOpacity
                        onPress={onClosePressed}
                        activeOpacity={0.2}
                        className="h-10 w-10 items-center justify-center"
                    >
                        <IconEvill name="close" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-medium">
                        {comment == null
                            ? ADD_COMMENT_TITLE
                            : ADD_COMMENT_EDIT_TITLE}
                    </Text>
                </View>
                <TouchableOpacity className="px-3" onPress={submit}>
                    <Text className="uppercase font-bold text-csecondary">
                        {ADD_COMMENT_SUBMIT}
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="px-5 pt-11 items-center">
                <Text className="text-xl font-medium">
                    {ADD_COMMENT_STAR_TITLE}
                </Text>
                <View className="mt-9">
                    <StarRating
                        starSize={25}
                        containerStyle={{ width: 200 }}
                        fullStarColor={customColors.star}
                        emptyStar={"star"}
                        emptyStarColor={customColors.cgrey.platinum}
                        rating={rating}
                        selectedStar={setRating}
                    />
                </View>
                <Text
                    className="mt-[100]"
                    style={{
                        fontSize: 18,
                        lineHeight: 30,
                    }}
                >
                    {ADD_COMMENT_DETAIL_TITLE}
                </Text>
                <View
                    className="rounded-lg my-5 w-full overflow-hidden border-cgrey-platinum p-3"
                    style={{ borderWidth: 1 }}
                >
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        placeholder={ADD_COMMENT_DETAIL_PLACEHOLDER}
                        value={detail}
                        textAlignVertical="top"
                        onChangeText={setDetail}
                        maxLength={500}
                        className="text-base py-2"
                    />
                    {(imageUri == null || imageUri === "") &&
                    (previousImageId == null || previousImageId === "") ? (
                        <IconLabelButton
                            iconPack="Ionicons"
                            iconProps={{
                                name: "camera-outline",
                                color: customColors.csecondary,
                                size: 30,
                            }}
                            buttonProps={{
                                onPress: selectImage,
                            }}
                        />
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={selectImage}
                            className="h-[380] mt-2 rounded-md overflow-hidden bg-ctertiary align-middle items-center"
                        >
                            <View className="w-full h-full">
                                {previousImageId != null &&
                                previousImageId !== "" ? (
                                    <ResourceImage
                                        className="h-full w-full"
                                        resourceId={previousImageId}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Image
                                        className="h-full w-full"
                                        source={{ uri: imageUri }}
                                    />
                                )}
                                <TouchableOpacity
                                    className="absolute top-3 right-3 w-[30] h-[30] rounded-md items-center justify-center"
                                    style={{
                                        backgroundColor: "#00000066",
                                    }}
                                    onPress={removeImage}
                                >
                                    <IconIon
                                        name="close"
                                        size={25}
                                        color={"#ffffff"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default AddEditComment;

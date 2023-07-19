import React, { View, Text } from "react-native";
import type PostComment from "../../types/PostComment";
import { memo, type FC, type ReactElement } from "react";
import ResourceImage from "@/common/components/ResourceImage";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import { customColors } from "@root/tailwind.config";
import "moment/locale/vi";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconLabelButton from "@/common/components/IconLabelButton";
import {
    REEL_COMMENTS_DELETE_BUTTON,
    REEL_COMMENTS_EDIT_BUTTON,
} from "@/common/strings";
import PostApi from "@/api/post/PostApi";
import { type PostType } from "@/api/post/types/PostResponse";

const getMenuItem = (
    iconName: string,
    text: string,
    onSelect?: () => void
): ReactElement => {
    return (
        <MenuOption onSelect={onSelect}>
            <IconLabelButton
                iconPack="Material"
                iconProps={{
                    name: iconName,
                    color: customColors.cgrey.dim,
                    size: 20,
                }}
                text={text}
                buttonProps={{ disabled: true }}
                buttonClassName="bg-transparent space-x-2 px-2 py-1"
            />
        </MenuOption>
    );
};

interface CommentItemProps {
    comment: PostComment;
    isThisUsersComment: boolean;
    postId: string;
    postType: PostType;
    openEditComment?: () => void;
    onDeleteSuccess?: () => void;
}

const CommentItem: FC<CommentItemProps> = ({
    comment,
    isThisUsersComment,
    postId,
    postType,
    openEditComment,
    onDeleteSuccess,
}) => {
    const deleteComment = async (): Promise<void> => {
        const result = await PostApi.deleteComment(postId, postType);
        if (result.success) {
            onDeleteSuccess?.();
        }
    };

    return (
        <View className="px-4 py-3 flex-row space-x-4">
            <ResourceImage
                resourceId={comment.avatar}
                className="w-[25] h-[25] rounded-full bg-xanthous items-center justify-center overflow-hidden"
                defaultView={<IconFeather name="user" size={17} />}
            />
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text
                        className="mr-3 text-cgrey-battleship font-semibold"
                        style={{ fontSize: 13 }}
                    >
                        {comment.username} •{" "}
                        {comment.createdAt.locale("vi").fromNow()}
                    </Text>
                    <StarRating
                        starSize={13}
                        containerStyle={{ width: 90 }}
                        fullStarColor={customColors.star}
                        emptyStar={"star"}
                        emptyStarColor={customColors.cgrey.platinum}
                        rating={comment.rating}
                    />
                </View>
                <Text>{comment.comment}</Text>
                {comment.image != null && comment.image !== "" && (
                    <ResourceImage
                        className="mt-2"
                        resourceId={comment.image}
                        width={300}
                    />
                )}
            </View>
            {isThisUsersComment && (
                <View>
                    <Menu>
                        <MenuTrigger>
                            <IconMaterial
                                name="more-vert"
                                color={customColors.cgrey.battleship}
                                size={20}
                            />
                        </MenuTrigger>
                        <MenuOptions
                            customStyles={{
                                optionsContainer: { width: 140 },
                            }}
                        >
                            {getMenuItem(
                                "edit",
                                REEL_COMMENTS_EDIT_BUTTON,
                                openEditComment
                            )}
                            {getMenuItem(
                                "delete",
                                REEL_COMMENTS_DELETE_BUTTON,
                                deleteComment
                            )}
                        </MenuOptions>
                    </Menu>
                </View>
            )}
        </View>
    );
};

export default memo(CommentItem);

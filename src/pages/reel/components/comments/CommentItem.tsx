import React, { View, Text } from "react-native";
import type PostComment from "../../types/PostComment";
import { memo, type ReactElement } from "react";
import ResourceImage from "@/common/components/ResourceImage";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import { customColors } from "@root/tailwind.config";
import "moment/locale/vi";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import {
    REEL_COMMENTS_DELETE_BUTTON,
    REEL_COMMENTS_EDIT_BUTTON,
} from "@/common/strings";
import CommentMenuItem from "./CommentMenuItem";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

interface CommentItemProps {
    comment: PostComment;
    isUserComment?: boolean;
    openEditComment?: () => void;
    onDeleteComment?: () => void;
}

const CommentItem = ({
    comment,
    isUserComment = false,
    openEditComment,
    onDeleteComment,
}: CommentItemProps): ReactElement<CommentItemProps> => {
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
            {isUserComment && (
                <View
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Menu>
                        <MenuTrigger>
                            <IconMaterial
                                name="more-vert"
                                color={customColors.cgrey.battleship}
                                size={16}
                            />
                        </MenuTrigger>
                        <MenuOptions
                            customStyles={{
                                optionsContainer: { width: 130 },
                            }}
                        >
                            <CommentMenuItem
                                icon="edit"
                                text={REEL_COMMENTS_EDIT_BUTTON}
                                onSelect={openEditComment}
                            />
                            <CommentMenuItem
                                icon="delete"
                                text={REEL_COMMENTS_DELETE_BUTTON}
                                onSelect={onDeleteComment}
                            />
                        </MenuOptions>
                    </Menu>
                </View>
            )}
        </View>
    );
};

export default memo(CommentItem);

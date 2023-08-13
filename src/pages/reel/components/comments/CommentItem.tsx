import React, { View, Text, TouchableOpacity } from "react-native";
import type PostComment from "../../types/PostComment";
import { memo, type ReactElement } from "react";
import ResourceImage from "@/common/components/ResourceImage";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import { customColors } from "@root/tailwind.config";
import "moment/locale/vi";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import FastImage from "react-native-fast-image";

interface CommentItemProps {
    comment: PostComment;
    isUserComment?: boolean;
    showCommentMenu?: () => void;
    showReportMenu?: (commentId: string) => void;
}

const CommentItem = ({
    comment,
    isUserComment = false,
    showCommentMenu,
    showReportMenu,
}: CommentItemProps): ReactElement<CommentItemProps> => {
    const handleShowCommentMenu = (): void => {
        if (showCommentMenu == null) {
            return;
        }
        showCommentMenu();
    };

    const handleShowReportMenu = (): void => {
        if (showReportMenu == null) {
            return;
        }
        showReportMenu(comment.commentId);
    };

    return (
        <View className="px-4 py-3 flex-row">
            <View className="w-[25] h-[25] rounded-full bg-xanthous items-center justify-center overflow-hidden">
                <View className="absolute top-0 bottom-0 left-0 right-0">
                    <IconFeather name="user" size={17} />
                </View>
                <FastImage
                    className="w-full h-full"
                    source={{ uri: comment.avatar }}
                />
            </View>
            <View className="flex-1 ml-4 mr-2">
                <View className="flex-row items-center overflow-hidden">
                    <Text
                        className="mr-3 text-cgrey-battleship text-xs font-semibold"
                        numberOfLines={1}
                    >
                        {comment.username} •{" "}
                        {comment.createdAt.locale("vi").fromNow()}
                    </Text>
                    <StarRating
                        starSize={11}
                        containerStyle={{ width: 60 }}
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
                        width={150}
                    />
                )}
            </View>
            {isUserComment ? (
                <View
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <TouchableOpacity onPress={handleShowCommentMenu}>
                        <IconMaterial
                            name="more-vert"
                            color={customColors.cgrey.battleship}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <View
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <TouchableOpacity onPress={handleShowReportMenu}>
                        <IconMaterial
                            name="more-vert"
                            color={customColors.cgrey.battleship}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default memo(CommentItem, (prev, next) => {
    return (
        prev.comment.comment === next.comment.comment &&
        prev.comment.image === next.comment.image
    );
});

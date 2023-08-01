import React, { View, Text, TouchableOpacity } from "react-native";
import type PostComment from "../../types/PostComment";
import { memo, type ReactElement } from "react";
import ResourceImage from "@/common/components/ResourceImage";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import { customColors } from "@root/tailwind.config";
import "moment/locale/vi";
import IconMaterial from "react-native-vector-icons/MaterialIcons";

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
        <View className="px-4 py-3 flex-row space-x-4">
            <ResourceImage
                resourceId={comment.avatar}
                className="w-[25] h-[25] rounded-full bg-xanthous items-center justify-center overflow-hidden"
                defaultView={<IconFeather name="user" size={17} />}
            />
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className="mr-3 text-cgrey-battleship text-sm font-semibold">
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
                            className="p-2"
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
                            className="p-2"
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

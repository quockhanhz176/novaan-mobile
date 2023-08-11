import React, { memo, useContext, type ReactElement } from "react";
import type PostComment from "../../types/PostComment";
import ResourceImage from "@/common/components/ResourceImage";
import { REEL_COMMENTS_BUTTON_TITLE } from "@/common/strings";
import { View, TouchableOpacity, Text } from "react-native";
import { Divider } from "react-native-paper";
import CommentItem from "./CommentItem";
import IconFeather from "react-native-vector-icons/Feather";
import { ScrollItemContext } from "../scroll-items/ScrollItemv2";

interface CommentListHeaderProps {
    userComment?: PostComment;
    showAddEdit: () => void;
    showCommentMenu: () => void;
}

const CommentListHeader = ({
    userComment,
    showAddEdit,
    showCommentMenu,
}: CommentListHeaderProps): ReactElement<CommentListHeaderProps> => {
    const { currentPost } = useContext(ScrollItemContext);

    if (userComment === undefined) {
        return (
            <View className="flex-1">
                <Divider />
                <View className="flex-1 flex-row justify-between items-center px-4 py-2 space-x-4">
                    <ResourceImage
                        resourceId=""
                        className="w-[25] h-[25] rounded-full bg-xanthous items-center justify-center overflow-hidden"
                        defaultView={<IconFeather name="user" size={17} />}
                    />
                    <TouchableOpacity
                        className="grow bg-cgrey-whitesmoke rounded-lg p-2 justify-center"
                        onPress={showAddEdit}
                        disabled={
                            currentPost == null || currentPost.status !== 1
                        }
                    >
                        <Text className="text-cgrey-grey">
                            {REEL_COMMENTS_BUTTON_TITLE}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Divider />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <CommentItem
                comment={userComment}
                isUserComment
                showCommentMenu={showCommentMenu}
            />
        </View>
    );
};

export default memo(CommentListHeader, (prev, next) => {
    return prev.userComment === next.userComment;
});

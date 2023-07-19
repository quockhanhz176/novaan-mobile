import { memo, type FC } from "react";
import React, {
    FlatList,
    View,
    Text,
    ScrollView,
    Modal,
    TouchableOpacity,
} from "react-native";
import type PostComment from "../../types/PostComment";
import CommentItem from "./CommentItem";
import {
    REEL_COMMENTS_BUTTON_EDIT_TITLE,
    REEL_COMMENTS_BUTTON_TITLE,
    REEL_COMMENTS_TITLE,
} from "@/common/strings";
import { Divider } from "react-native-paper";
import IconLabelButton from "@/common/components/IconLabelButton";
import { customColors } from "@root/tailwind.config";
import IconFeather from "react-native-vector-icons/Feather";
import ResourceImage from "@/common/components/ResourceImage";
import useModalHook from "./ScrollModalHook";
import AddEditComment from "./AddEditComment";
import type Post from "../../types/Post";

interface CommentsProps {
    comments: PostComment[];
    post: Post;
    thisUserComment?: PostComment;
    reloadComments: () => Promise<void>;
    closeComments?: () => void;
}

const Comments: FC<CommentsProps> = ({
    comments,
    post,
    thisUserComment,
    reloadComments,
    closeComments,
}) => {
    const [addEditCommentVisible, hideAddEditComment, showAddEditComment] =
        useModalHook();

    const onClosePress = (): void => {
        closeComments?.();
    };

    const header = (
        <View>
            <View className="flex-row justify-between items-center px-4 py-2 space-x-4 h-[48]">
                <ResourceImage
                    resourceId=""
                    className="w-[25] h-[25] rounded-full bg-xanthous items-center justify-center overflow-hidden"
                    defaultView={<IconFeather name="user" size={17} />}
                />

                <TouchableOpacity
                    className="h-full grow bg-cgrey-whitesmoke rounded-sm px-3 justify-center"
                    onPress={showAddEditComment}
                >
                    <Text className="text-cgrey-grey">
                        {thisUserComment == null
                            ? REEL_COMMENTS_BUTTON_TITLE
                            : REEL_COMMENTS_BUTTON_EDIT_TITLE}
                    </Text>
                </TouchableOpacity>
            </View>
            <Divider bold />
        </View>
    );

    return (
        <View className="flex-1 justify-end">
            <View
                className="w-full h-[470] bg-white rounded-t-xl pt-[22]"
                onTouchEnd={(e) => {
                    e.stopPropagation();
                }}
            >
                <View className="pb-2 pl-4 start flex-row justify-between">
                    <View className="flex-row items-center space-x-4">
                        <Text className="text-lg font-bold">
                            {REEL_COMMENTS_TITLE}
                        </Text>
                        <Text className="text-cgrey-dim">
                            {comments.length}
                        </Text>
                    </View>
                    <View className="pr-2">
                        <IconLabelButton
                            iconPack="Evil"
                            iconProps={{
                                name: "close",
                                color: customColors.cgrey.battleship,
                            }}
                            buttonProps={{
                                onPress: onClosePress,
                            }}
                        />
                    </View>
                </View>
                <Divider bold />
                <ScrollView>
                    <FlatList
                        data={comments}
                        ListHeaderComponent={header}
                        renderItem={({ item }) => (
                            <CommentItem
                                comment={item}
                                isThisUsersComment={
                                    thisUserComment?.userId === item.userId
                                }
                                postId={post.id}
                                postType={post.type}
                                onDeleteSuccess={reloadComments}
                                openEditComment={showAddEditComment}
                            />
                        )}
                    />
                </ScrollView>
            </View>
            <Modal
                visible={addEditCommentVisible}
                animationType="slide"
                onRequestClose={hideAddEditComment}
            >
                <AddEditComment
                    hideAddComment={hideAddEditComment}
                    post={post}
                    thisUserComment={thisUserComment}
                    onSuccess={() => {
                        void reloadComments();
                    }}
                />
            </Modal>
        </View>
    );
};

export default memo(Comments);

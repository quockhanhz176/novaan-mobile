import { useEffect, useMemo, useContext, type ReactElement } from "react";
import React, {
    FlatList,
    View,
    Text,
    Modal,
    TouchableOpacity,
} from "react-native";
import type PostComment from "../../types/PostComment";
import CommentItem from "./CommentItem";
import {
    ADD_COMMENT_UPLOAD_ERROR,
    REEL_COMMENTS_BUTTON_TITLE,
    REEL_COMMENTS_TITLE,
} from "@/common/strings";
import { Divider } from "react-native-paper";
import IconLabelButton from "@/common/components/IconLabelButton";
import { customColors } from "@root/tailwind.config";
import IconFeather from "react-native-vector-icons/Feather";
import ResourceImage from "@/common/components/ResourceImage";
import AddEditComment from "./AddEditComment";
import { usePostComments, useSendComment } from "@/api/post/PostApiHook";
import { type Undefinable } from "@/types/app";
import { ScrollItemContext } from "../scroll-items/ScrollItemv2";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import type CommentInformation from "@/api/post/types/CommentInformation";
import Toast from "react-native-toast-message";
import { getRequestPostType } from "@/api/post/types/RequestPostType";
import useModalHook from "@/common/components/ModalHook";

interface CommentsProps {
    closeComments?: () => void;
}

const Comments = ({
    closeComments,
}: CommentsProps): ReactElement<CommentsProps> => {
    const { currentUserId, currentPost } = useContext(ScrollItemContext);
    const { comments, fetchComments, deleteComment } = usePostComments();
    const { sendComment } = useSendComment();

    // const [showCommentModal, setShowCommentModal] = useState(false);
    const [addEditVisible, showAddEdit, hideAddEdit] = useModalHook();

    const userComment: Undefinable<PostComment> = useMemo(() => {
        if (comments.length === 0) {
            return undefined;
        }

        return comments.find((comment) => comment.userId === currentUserId);
    }, [comments]);

    const minimalPostInfo = useMemo((): Undefinable<MinimalPost> => {
        if (currentPost == null) {
            return undefined;
        }
        return {
            postId: currentPost.id,
            postType: currentPost.type === "recipe" ? "Recipe" : "CulinaryTip",
        };
    }, [currentPost]);

    useEffect(() => {
        if (minimalPostInfo == null) {
            return;
        }
        void fetchComments(minimalPostInfo);
    }, [minimalPostInfo]);

    const refreshComments = async (): Promise<void> => {
        if (minimalPostInfo == null) {
            return;
        }

        await fetchComments(minimalPostInfo);
    };

    const onClosePress = (): void => {
        closeComments?.();
    };

    const handleSubmitComment = async (
        commentInfo: CommentInformation
    ): Promise<void> => {
        if (currentPost == null) {
            return;
        }
        const action = userComment == null ? "add" : "edit";
        const success = await sendComment(
            {
                postId: currentPost.id,
                postType: getRequestPostType(currentPost.type),
            },
            commentInfo,
            action
        );
        if (!success) {
            Toast.show({
                type: "error",
                text1: ADD_COMMENT_UPLOAD_ERROR,
            });
            return;
        }
        await refreshComments();
    };

    const handleDeleteComment = async (): Promise<void> => {
        if (minimalPostInfo == null) {
            return;
        }
        // Ignore delete request when failed, reload comment second when succeed
        const result = await deleteComment(minimalPostInfo);
        if (!result) {
            return;
        }
        await fetchComments(minimalPostInfo);
    };

    // Show existed user's comment or form for user to input their rating
    const header = (
        <View className="flex-1">
            <Divider />
            {userComment == null ? (
                <>
                    <View className="flex-row justify-between items-center px-4 py-2 space-x-4">
                        <ResourceImage
                            resourceId=""
                            className="w-[25] h-[25] rounded-full bg-xanthous items-center justify-center overflow-hidden"
                            defaultView={<IconFeather name="user" size={17} />}
                        />
                        <TouchableOpacity
                            className="grow bg-cgrey-whitesmoke rounded-lg p-2 justify-center"
                            onPress={showAddEdit}
                        >
                            <Text className="text-cgrey-grey">
                                {REEL_COMMENTS_BUTTON_TITLE}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Divider />
                </>
            ) : (
                <CommentItem
                    comment={userComment}
                    isUserComment
                    onDeleteComment={handleDeleteComment}
                    openEditComment={showAddEdit}
                />
            )}
        </View>
    );

    return (
        <View className="flex-1 justify-end">
            <View
                className="bg-white rounded-t-xl pt-4 h-2/3"
                onTouchEnd={(e) => {
                    e.stopPropagation();
                }}
            >
                <View className="pb-4 pl-4 start flex-row justify-between items-center">
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
                                size: 24,
                            }}
                            buttonProps={{
                                onPress: onClosePress,
                            }}
                        />
                    </View>
                </View>
                <FlatList
                    data={comments}
                    ListHeaderComponent={header}
                    renderItem={({ item }) => {
                        if (item.userId === currentUserId) {
                            return <View></View>;
                        }

                        return (
                            <CommentItem
                                comment={item}
                                onDeleteComment={handleDeleteComment}
                                openEditComment={showAddEdit}
                            />
                        );
                    }}
                />
            </View>
            {currentPost != null && (
                <Modal
                    visible={addEditVisible}
                    animationType="slide"
                    onRequestClose={hideAddEdit}
                >
                    <AddEditComment
                        comment={userComment}
                        onClose={hideAddEdit}
                        onSubmit={handleSubmitComment}
                    />
                </Modal>
            )}
        </View>
    );
};

export default Comments;

import {
    useEffect,
    useMemo,
    useContext,
    type ReactElement,
    memo,
    useCallback,
    useState,
} from "react";
import React, { FlatList, View, Text, Modal } from "react-native";
import type PostComment from "../../types/PostComment";
import CommentItem from "./CommentItem";
import {
    ADD_COMMENT_UPLOAD_ERROR,
    REEL_COMMENTS_TITLE,
    REEL_REPORT_FORM_REPORT_FAIL_MESSAGE,
    REEL_REPORT_FORM_REPORT_SUCCESS_MESSAGE,
} from "@/common/strings";
import IconLabelButton from "@/common/components/IconLabelButton";
import { customColors } from "@root/tailwind.config";
import AddEditComment from "./AddEditComment";
import {
    usePostComments,
    useReportComment,
    useSendComment,
} from "@/api/post/PostApiHook";
import { type Undefinable } from "@/types/app";
import { ScrollItemContext } from "../scroll-items/ScrollItemv2";
import {
    type MinimalComment,
    type MinimalPost,
} from "@/api/post/types/PostListResponse";
import type CommentInformation from "@/api/post/types/CommentInformation";
import Toast from "react-native-toast-message";
import { getRequestPostType } from "@/api/post/types/RequestPostType";
import useBooleanHook from "@/common/components/BooleanHook";
import CustomModal from "@/common/components/CustomModal";
import CommentMenu from "./CommentMenu";
import ReportMenu from "./ReportMenu";
import CommentListHeader from "./CommentListHeader";
import ReportForm from "../report/ReportForm";

interface CommentsProps {
    closeComments?: () => void;
}

const Comments = ({
    closeComments,
}: CommentsProps): ReactElement<CommentsProps> => {
    const { currentUserId, currentPost } = useContext(ScrollItemContext);
    const { comments, fetchComments, deleteComment } = usePostComments();
    const { sendComment } = useSendComment();
    const { reportComment } = useReportComment();

    const [addEditVisible, hideAddEdit, showAddEdit] = useBooleanHook();
    const [commentMenuVisible, hideCommentMenu, showCommentMenu] =
        useBooleanHook();
    const [reportMenuVisible, hideReportMenu, showReportMenu] =
        useBooleanHook();
    const [reportFormVisible, hideReportForm, showReportForm] =
        useBooleanHook();

    const [selectedComment, setSelectedComment] =
        useState<Undefinable<string>>(undefined);

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

        // Check if comment need to edit
        if (action === "edit") {
            if (
                commentInfo.image == null &&
                commentInfo.comment === userComment?.comment &&
                commentInfo.previousImageId === userComment?.image &&
                commentInfo.rating === userComment?.rating
            ) {
                return;
            }
        }

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
        hideCommentMenu();
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

    const handleOpenReportMenu = (commentId: string): void => {
        showReportMenu();
        setSelectedComment(commentId);
    };

    const handleCloseReportForm = (): void => {
        hideReportForm();
        hideReportMenu();
        setSelectedComment(undefined);
    };

    const handleCloseAddEdit = (): void => {
        hideAddEdit();
        hideCommentMenu();
    };

    const handleReportComment = async (reason: string): Promise<void> => {
        if (currentPost == null || selectedComment === undefined) {
            return;
        }
        const payload: MinimalComment = {
            postId: currentPost.id,
            commentId: selectedComment,
            postType: currentPost.type === "recipe" ? "Recipe" : "CulinaryTip",
        };
        const succeed = await reportComment(payload, reason);
        if (!succeed) {
            Toast.show({
                type: "error",
                text1: REEL_REPORT_FORM_REPORT_FAIL_MESSAGE,
            });
        }
        Toast.show({
            type: "success",
            text1: REEL_REPORT_FORM_REPORT_SUCCESS_MESSAGE,
        });

        hideReportMenu();
        setSelectedComment(undefined);
    };

    const renderItem = useCallback(
        ({ item }: { item: PostComment }) => {
            if (item.userId === currentUserId) {
                return <View></View>;
            }

            return (
                <CommentItem
                    comment={item}
                    showReportMenu={handleOpenReportMenu}
                />
            );
        },
        [currentUserId]
    );

    return (
        <View className="flex-1 justify-end">
            <View
                className="bg-white rounded-t-xl pt-4 h-2/3"
                onTouchStart={(e) => {
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
                    ListHeaderComponent={
                        <CommentListHeader
                            userComment={userComment}
                            showAddEdit={showAddEdit}
                            showCommentMenu={showCommentMenu}
                        />
                    }
                    ListHeaderComponentStyle={{ flex: 1 }}
                    renderItem={renderItem}
                    extraData={userComment}
                />
            </View>
            {currentPost != null && (
                <>
                    <Modal
                        visible={addEditVisible}
                        animationType="slide"
                        onRequestClose={handleCloseAddEdit}
                    >
                        <AddEditComment
                            comment={userComment}
                            onClose={hideAddEdit}
                            onSubmit={handleSubmitComment}
                        />
                    </Modal>
                    <CustomModal
                        visible={reportMenuVisible}
                        onDismiss={hideReportMenu}
                    >
                        <ReportMenu handleReportComment={showReportForm} />
                    </CustomModal>
                    <Modal
                        visible={reportFormVisible}
                        onRequestClose={hideReportForm}
                        animationType="slide"
                    >
                        <ReportForm
                            onClose={handleCloseReportForm}
                            onSubmit={handleReportComment}
                        />
                    </Modal>
                </>
            )}
            {
                // Only render when user have a comment
                currentPost != null && userComment != null && (
                    <>
                        <CustomModal
                            visible={commentMenuVisible}
                            onDismiss={hideCommentMenu}
                        >
                            <CommentMenu
                                handleEditComment={showAddEdit}
                                handleDeleteComment={handleDeleteComment}
                            />
                        </CustomModal>
                    </>
                )
            }
            <Toast />
        </View>
    );
};

export default memo(Comments);

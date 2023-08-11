import { type Undefinable } from "@/types/app";
import { type MinimalComment, type MinimalPost } from "./PostListResponse";
import type PostComment from "@/pages/reel/types/PostComment";
import type Post from "@/pages/reel/types/Post";
import { type CommentFormInfo } from "./CommentInformation";

export interface PostInteraction {
    postId: string;
    postType: "Recipe" | "CulinaryTip";
    action: boolean;
}

export interface UsePostListReturn {
    postList: MinimalPost[];
    fetchPostList: () => Promise<boolean>;
}

export interface UsePostInfoReturn {
    postInfo: Undefinable<Post>;
    fetchPostInfo: (info: MinimalPost) => Promise<Undefinable<Post>>;
}

export interface UsePostCommentsReturn {
    comments: PostComment[];
    fetchComments: (info: MinimalPost) => Promise<boolean>;
    deleteComment: (info: MinimalPost) => Promise<boolean>;
}

export interface UseSendCommentReturn {
    sendComment: (
        postInfo: MinimalPost,
        commentInfo: CommentFormInfo,
        action: "add" | "edit"
    ) => Promise<boolean>;
}

export interface UseReportCommentReturn {
    reportComment: (
        commentInfo: MinimalComment,
        reason: string
    ) => Promise<boolean>;
}

export interface UsePostSaveReturn {
    savePost: (
        interaction: PostInteraction,
        userId?: string
    ) => Promise<boolean>;
    likePost: (
        interaction: PostInteraction,
        userId?: string
    ) => Promise<boolean>;
}

export interface UsePostReportReturn {
    reportPost: (postInfo: MinimalPost, reason: string) => Promise<boolean>;
}

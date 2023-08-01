import type Post from "../../types/Post";

export interface LikeInfo {
    liked: boolean;
    likeCount: number;
}

export type Page =
    | "Profile"
    | "Video"
    | "Details"
    | "Changing"
    | "PostReport"
    | "Comments"
    | "AddComment";

export interface IScrollItemContext {
    currentPost?: Post;
    currentUserId: string;
    likeInfo: LikeInfo;
    saved: boolean;
    handleLike: () => void;
    handleUnlike: () => void;
    handleSave: () => void;
    handleUnsave: () => void;
    pauseVideo: () => void;
    resumeVideo: () => void;
    nextVideo: () => void;
}

export const scrollItemInitialStates: IScrollItemContext = {
    currentPost: undefined,
    currentUserId: "",
    likeInfo: { liked: false, likeCount: 0 },
    saved: false,
    handleLike: () => {},
    handleUnlike: () => {},
    handleSave: () => {},
    handleUnsave: () => {},
    pauseVideo: () => {},
    resumeVideo: () => {},
    nextVideo: () => {},
};

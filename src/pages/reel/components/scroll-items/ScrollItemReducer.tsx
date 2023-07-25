import type Post from "../../types/Post";

export type ScrollItemAction =
    | "INIT"
    | "SAVE_POST"
    | "UNSAVE_POST"
    | "LIKE_POST"
    | "UNLIKE_POST";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ScrollItemReducerState {
    currentPost?: Post;
}

export const scrollItemReducer = (
    state: ScrollItemReducerState,
    { type, payload }: { type: ScrollItemAction; payload?: any }
): ScrollItemReducerState => {
    switch (type) {
        case "INIT":
            return { ...state, ...payload };
        case "LIKE_POST":
            if (state.currentPost == null || state.currentPost.isLiked) {
                return state;
            }

            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    isLiked: true,
                    likeCount: state.currentPost.likeCount + 1,
                },
            };
        case "UNLIKE_POST":
            if (state.currentPost == null || !state.currentPost.isLiked) {
                return state;
            }
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    isLiked: false,
                    likeCount: state.currentPost.likeCount - 1,
                },
            };
        case "SAVE_POST":
            if (state.currentPost == null || state.currentPost.isSaved) {
                return state;
            }
            return {
                ...state,
                currentPost: { ...state.currentPost, isSaved: true },
            };
        case "UNSAVE_POST":
            if (state.currentPost == null || !state.currentPost.isSaved) {
                return state;
            }
            return {
                ...state,
                currentPost: { ...state.currentPost, isSaved: false },
            };
        default:
            return state;
    }
};

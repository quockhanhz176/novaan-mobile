export interface MinimalPost {
    postId: string;
    postType: "Recipe" | "CulinaryTip";
}

export interface MinimalComment {
    postId: string;
    commentId: string;
    postType: "Recipe" | "CulinaryTip";
}

type PostListResponse = MinimalPost[];

export default PostListResponse;

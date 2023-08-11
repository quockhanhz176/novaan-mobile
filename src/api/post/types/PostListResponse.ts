export interface MinimalPost {
    postId: string;
    postType: "Recipe" | "CulinaryTip";
}

export interface MinimalComment {
    postId: string;
    commentId: string;
    postType: "Recipe" | "CulinaryTip";
}

export interface MinimalPostResponse {
    id: string;
    title: string;
    thumbnail: string;
    type: "Recipe" | "CulinaryTip";
    status: number;
}

type PostListResponse = MinimalPost[];

export default PostListResponse;

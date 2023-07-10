export interface MinimalPost {
    postId: string;
    postType: "Recipe" | "CulinaryTip";
}

type PostListResponse = MinimalPost[];

export default PostListResponse;

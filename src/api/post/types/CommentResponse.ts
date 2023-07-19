interface CommentResponse {
    commentId: string;
    userId: string;
    username: string;
    avatar: string;
    comment?: string;
    image?: string;
    rating: number;
    createdAt: string;
}

export default CommentResponse;

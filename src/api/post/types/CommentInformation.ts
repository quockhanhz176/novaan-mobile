import { type PostType } from "./PostResponse";

interface CommentInformation {
    postId: string;
    rating: number;
    postType: PostType;
    comment?: string;
    image?: {
        uri: string;
        extension: string;
    };
    previousImageId?: string;
}

export default CommentInformation;

import type CommentResponse from "@/api/post/types/CommentResponse";
import { type Moment } from "moment";

type Comment = Omit<CommentResponse, "createdAt"> & {
    createdAt: Moment;
};

export default Comment;

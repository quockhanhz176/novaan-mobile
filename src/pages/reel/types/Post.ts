import type PostResponse from "@/api/post/types/PostResponse";
import type User from "./User";
import type RecipeTime from "@/pages/create-post/create-recipe/types/RecipeTime";

type Post = PostResponse & {
    creator: User;
    prepTime: RecipeTime;
    cookTime: RecipeTime;
};

export default Post;

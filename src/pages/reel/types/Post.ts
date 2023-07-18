import type PostResponse from "@/api/post/types/PostResponse";
import type User from "./User";
import type RecipeTime from "@/pages/create-post/create-recipe/types/RecipeTime";
import { type IntersectUnion, type DistributiveOmit } from "@/common/utils";

export type Post = IntersectUnion<
    DistributiveOmit<PostResponse, "prepTime" | "cookTime" | "creatorId"> & {
        creator: User;
    },
    { type: "recipe" },
    {
        prepTime: RecipeTime;
        cookTime: RecipeTime;
    }
>;

export default Post;

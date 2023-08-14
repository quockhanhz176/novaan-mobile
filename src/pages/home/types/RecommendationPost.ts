import { type PostType } from "@/api/post/types/PostResponse";
import {
    type RecommendationRecipeResponse,
    type RecommendationTipResponse,
} from "@/api/recommendation/types/RecommendationPostResponse";

export type WithPostType<T> = T & { postType: PostType };

export type RecommendationTip = RecommendationTipResponse & {
    type: "tip";
};

export type RecommendationRecipe = RecommendationRecipeResponse & {
    type: "recipe";
};

export type RecommendationPost = RecommendationTip | RecommendationRecipe;

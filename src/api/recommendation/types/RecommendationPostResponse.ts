import { type PostType } from "@/api/post/types/PostResponse";

export interface RecommendationPostResponseBase {
    id: string;
    authorId: string;
    avatar: string;
    authorName: string;
    title: string;
    thumbnails: string;
    averageRating: number;
    likeCount: number;
    popularityScore: number;
    postType?: "Recipe" | "CulinaryTip";
}

export type RecommendationTipResponse = RecommendationPostResponseBase;

export type RecommendationRecipeResponse = RecommendationPostResponseBase & {
    cookTime: string;
};

export type RecommendationPostResponse =
    | RecommendationTipResponse
    | RecommendationRecipeResponse;

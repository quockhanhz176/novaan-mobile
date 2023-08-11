interface RecommendationPostResponseBase {
    id: string;
    authorId: string;
    avatar: string;
    authorName: string;
    title: string;
    thumbnails: string;
    averageRating: number;
    likeCount: number;
    popularityScore: number;
}

export type RecommendationTipResponse = RecommendationPostResponseBase;

export type RecommendationRecipeResponse = RecommendationPostResponseBase & {
    cookTime: string;
};

export type RecommendationPostResponse =
    | RecommendationTipResponse
    | RecommendationRecipeResponse;

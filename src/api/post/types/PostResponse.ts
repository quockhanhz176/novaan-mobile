import { type Undefinable } from "@/types/app";

export type PostStatus = "Pending" | "Approved" | "Rejected" | "Reported";

export interface AdminComment {
    id: string | null;
    comment: string;
    createdAt: string;
}

export interface PostResponseBase {
    id: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar: string;
    title: string;
    description: string;
    video: string;
    thumbnail: string;
    status: PostStatus;
    createdAt?: Date; // 2023-06-29T20:11:06.124Z
    updatedAt?: Date;
    adminComment?: AdminComment;
    isLiked: boolean;
    isSaved: boolean;
    likeCount: number;
    averageRating: number;
    ratingCount: number;
}

export interface Instruction {
    step: number;
    description: string;
    image?: string;
}

export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

export type RecipeResponse = PostResponseBase & {
    type: "recipe";
    difficulty: number;
    portionQuantity: number;
    portionType: number;
    prepTime: string;
    cookTime: string;
    instructions: Instruction[];
    ingredients: Ingredient[];
    diets: Undefinable<string[]>;
    mealTypes: Undefinable<string[]>;
    cuisines: Undefinable<string[]>;
    allergens: Undefinable<string[]>;
};

export type TipResponse = PostResponseBase & {
    type: "tip";
};

type PostResponse = RecipeResponse | TipResponse;

export type PostType = PostResponse["type"];

export default PostResponse;

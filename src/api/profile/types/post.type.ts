import {
    type RecipeResponse,
    type TipResponse,
} from "@/api/post/types/PostResponse";

interface GetUserContentReturn {
    getNext: () => Promise<boolean>;
    refresh: () => void;
    ended: boolean;
}

export interface GetUserRecipeReturn extends GetUserContentReturn {
    recipes: RecipeResponse[];
}

export interface GetUserTipReturn extends GetUserContentReturn {
    tips: TipResponse[];
}

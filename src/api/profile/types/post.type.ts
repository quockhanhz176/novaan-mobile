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

export interface GetUserContentHookReturn {
    ended: boolean;
    getContent: <T>(start: number, limit: number) => Promise<T[]>;
    getNext: <T>() => Promise<T[]>;
    refresh: () => void;
}

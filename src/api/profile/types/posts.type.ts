import { type RecipeInfo, type TipsInfo } from "@/api/post/types/post.type";

interface GetUserContentReturn {
    getNext: () => Promise<boolean>;
    getPrev: () => Promise<boolean>;
    getPage: (pageNum: number) => RecipeInfo[];
}

export interface GetUserRecipeReturn extends GetUserContentReturn {
    recipes: RecipeInfo[];
}

export interface GetUserTipReturn extends GetUserContentReturn {
    tips: TipsInfo[];
}

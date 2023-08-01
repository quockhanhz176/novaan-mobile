import postApi from "@/api/post/PostApi";
import type PostResponse from "@/api/post/types/PostResponse";
import searchApi from "@/api/search/SearchApi";
import type PreferenceSuite from "../types/PreferenceSuite";
import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import {
    FILTER_CATEGORY_ALLERGEN,
    FILTER_CATEGORY_CUISINE,
    FILTER_CATEGORY_DIET,
} from "@/common/strings";
import { type RecipeResponse } from "@/api/post/types/PostResponse";

const searchPost = async (query: string): Promise<PostResponse[] | null> => {
    const minimalPostsResult = await postApi.getPostList();
    if (!minimalPostsResult.success) {
        return null;
    }

    const posts: PostResponse[] = [];

    for (const mPost of minimalPostsResult.value) {
        const result = await postApi.getPost(
            mPost.postId,
            mPost.postType === "Recipe" ? "recipe" : "tip"
        );
        if (result.success) {
            posts.push(result.value);
        }
    }

    return posts;
};

const objectMap = <UProp, U extends Record<string, UProp>, TProp>(
    obj: U,
    func: (value: UProp, key: string, index?: number) => TProp
): Record<keyof U, TProp> => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v], i) => [k, func(v, k, i)])
    ) as any;
};

const categoryNames: Record<keyof PreferenceSuite, string> = {
    diets: FILTER_CATEGORY_DIET,
    cuisines: FILTER_CATEGORY_CUISINE,
    allergens: FILTER_CATEGORY_ALLERGEN,
};

const getPreferences = async (): Promise<PreferenceSuite | null> => {
    const preferenceResponse = await searchApi.getPreferences();

    if (!preferenceResponse.success) {
        return null;
    }

    let categoryIndex = 0;

    const suite: PreferenceSuite = objectMap(
        preferenceResponse.value,
        (v: PreferenceResponse[], k, i) => {
            let preferenceIndex = 0;
            return {
                label: categoryNames[k],
                preferences: v.map((value) => ({
                    ...value,
                    checked: false,
                    index: preferenceIndex++,
                })),
                index: categoryIndex++,
            };
        }
    );
    return suite;
};

const searchAdvanced = async (
    ingredients: string[],
    start: number,
    size: number
): Promise<RecipeResponse[] | null> => {
    const result = await searchApi.getAdvancedSearchResult(
        ingredients,
        start,
        size
    );

    if (!result.success) {
        return null;
    }

    const posts: RecipeResponse[] = [];

    for (const p of result.value) {
        const result = await postApi.getPost(p.id, "recipe");
        if (result.success) {
            if (result.value.type === "recipe") {
                posts.push(result.value);
            }
        }
    }

    return posts;
};

const searchServices = {
    searchPost,
    getPreferences,
    searchAdvanced,
};

export default searchServices;

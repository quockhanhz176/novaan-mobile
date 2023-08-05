import postApi from "@/api/post/PostApi";
import searchApi from "@/api/search/SearchApi";
import type PreferenceSuite from "../types/PreferenceSuite";
import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import {
    FILTER_CATEGORY_ALLERGEN,
    FILTER_CATEGORY_CUISINE,
    FILTER_CATEGORY_DIET,
} from "@/common/strings";
import {
    type PostType,
    type RecipeResponse,
} from "@/api/post/types/PostResponse";
import type SearchRequest from "@/api/search/types/SearchRequest";
import type PreferenceCategory from "../types/PreferenceCategory";
import { type MinimalPostInfo } from "@/api/profile/types";

const mapCategory = (category: PreferenceCategory): string[] | undefined => {
    const result = category.preferences.flatMap((value) =>
        value.checked ? value.title : []
    );
    return result.length === 0 ? undefined : result;
};

const searchPost = async (
    queryString: string,
    postType: PostType,
    suite?: PreferenceSuite,
    start?: number,
    limit?: number,
    sortType?: SearchRequest["sortType"],
    difficulty?: SearchRequest["difficulty"],
    categories?: string[]
): Promise<MinimalPostInfo[] | null> => {
    const minimalPostsResult = await postApi.getPostList();
    if (!minimalPostsResult.success) {
        return null;
    }

    const result = await searchApi.search(
        {
            queryString,
            start,
            limit,
            sortType,
            difficulty,
            categories,
            allergens: suite != null ? mapCategory(suite.allergens) : undefined,
            cuisines: suite != null ? mapCategory(suite.cuisines) : undefined,
            diets: suite != null ? mapCategory(suite.diets) : undefined,
        },
        postType
    );

    const postInfos = result.success
        ? result.value.map((value) => {
              return { ...value, type: postType };
          })
        : null;

    return postInfos;
};

const objectMap = <UProp, U extends Record<string, UProp>, TProp>(
    obj: U,
    func: (value: UProp, key: keyof U, index?: number) => TProp
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

    const userPreferenceResponse = await searchApi.getUserPreferences();
    const userPreferences = userPreferenceResponse.success
        ? userPreferenceResponse.value
        : null;

    let categoryIndex = 0;

    const suite: PreferenceSuite = objectMap(
        preferenceResponse.value,
        (preferenceResponses: PreferenceResponse[], k, _i) => {
            let preferenceIndex = 0;
            return {
                label: categoryNames[k],
                preferences: preferenceResponses.map((preferenceResponse) => ({
                    ...preferenceResponse,
                    checked:
                        userPreferences?.[k].find(
                            (userPreference) =>
                                userPreference === preferenceResponse.title
                        ) != null,
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

const getIngredients = async (keyword: string): Promise<string[] | null> => {
    const result = await searchApi.getAdvancedSearchIngredients(keyword);
    return result.success ? result.value : null;
};

const searchServices = {
    searchPost,
    getPreferences,
    searchAdvanced,
    getIngredients,
};

export default searchServices;

import { capitalizeFirstLetter } from "@/common/utils";
import BaseApi, { HttpMethod } from "../BaseApi";
import { type FailableResponse } from "../common/types/FailableResponse";
import type AdvancedSearchRecipeResponse from "./types/AdvancedSearchRecipeResponse";
import type PreferenceSuiteResponse from "./types/PreferenceSuiteResponse";
import type SearchRequest from "./types/SearchRequest";
import { type PostType } from "../post/types/PostResponse";
import {
    type SearchResponseRecipe,
    type SearchResponseTip,
} from "./types/SearchResponsePost";
import type UserSearchResponse from "./types/UserSearchResponse";
import type AutocompeletePostResponse from "./types/AutocompletePostResponse";

const GET_PREFERENCES_URL = "preference/all";
const USER_PREFERENCES_URL = "preference/me";
const RECIPE_SEARCH_URL = "search/recipes";
const TIP_SEARCH_URL = "search/tips";
const USER_SEARCH_URL = "search/users";
const ADVANCED_SEARCH_URL = "search/advanced/recipes";
const ADVANCED_SEARCH_INGREDIENT_URL = "search/advanced/ingredients";
const BASIC_SEARCH_AUTOCOMPLETE_URL = "search/basic/autocomplete";

const baseApi = new BaseApi();

const getPreferences = async (): Promise<
    FailableResponse<PreferenceSuiteResponse>
> => {
    return await baseApi.sendReceiveBase(
        GET_PREFERENCES_URL,
        "SearchApi.getPreferences",
        HttpMethod.GET
    );
};

const getUserPreferences = async (): Promise<
    FailableResponse<Record<keyof PreferenceSuiteResponse, string[]>>
> => {
    return await baseApi.sendReceiveBase(
        USER_PREFERENCES_URL,
        "SearchApi.getUserPreferences",
        HttpMethod.GET
    );
};

const getAdvancedSearchResult = async (
    ingredients: string[],
    start: number,
    size: number
): Promise<FailableResponse<AdvancedSearchRecipeResponse[]>> => {
    const searchParams = new URLSearchParams("");
    ingredients.forEach((ingredient) => {
        searchParams.append("Ingredients", ingredient);
    });
    searchParams.append("Pagination.Start", start.toString());
    searchParams.append("Pagination.Limit", size.toString());
    return await baseApi.sendReceiveBase(
        ADVANCED_SEARCH_URL + "?" + searchParams.toString(),
        "SearchApi.getAdvancedSearchResult",
        HttpMethod.GET
    );
};

const getAdvancedSearchIngredients = async (
    keyword: string
): Promise<FailableResponse<string[]>> => {
    return await baseApi.sendReceiveBase(
        ADVANCED_SEARCH_INGREDIENT_URL + "?keyword=" + keyword,
        "SearchApi.getAdvancedSearchIngredients",
        HttpMethod.GET
    );
};

const addToParams = <T>(
    params: URLSearchParams,
    request: T,
    property: keyof T,
    fieldName?: string
): void => {
    if (request[property] == null) {
        return;
    }

    const name = fieldName ?? capitalizeFirstLetter(property.toString());

    if (Array.isArray(request[property])) {
        (request[property] as any).forEach((item) => {
            params.append(name, item.toString());
        });
        return;
    }

    params.append(name, (request[property] as any).toString());
};

const searchPost = async <
    T extends PostType,
    R extends T extends "recipe" ? SearchResponseRecipe : SearchResponseTip
>(
    request: SearchRequest,
    postType: T
): Promise<FailableResponse<R[]>> => {
    const searchParams = new URLSearchParams("");
    addToParams(searchParams, request, "queryString", "SearchTerm");
    addToParams(searchParams, request, "start", "Pagination.Start");
    addToParams(searchParams, request, "limit", "Pagination.Limit");
    addToParams(searchParams, request, "sortType");
    addToParams(searchParams, request, "difficulty");
    addToParams(searchParams, request, "allergens");
    addToParams(searchParams, request, "cuisines");
    addToParams(searchParams, request, "diets");
    addToParams(searchParams, request, "categories");
    const requestUrl =
        (postType === "recipe" ? RECIPE_SEARCH_URL : TIP_SEARCH_URL) +
        "?" +
        searchParams.toString();
    return await baseApi.sendReceiveBase<R[]>(
        requestUrl,
        "SearchApi.searchPost",
        HttpMethod.GET
    );
};

const searchUser = async (
    request: SearchRequest
): Promise<FailableResponse<UserSearchResponse[]>> => {
    const searchParams = new URLSearchParams("");
    addToParams(searchParams, request, "queryString", "SearchTerm");
    addToParams(searchParams, request, "start", "Pagination.Start");
    addToParams(searchParams, request, "limit", "Pagination.Limit");
    addToParams(searchParams, request, "sortType");
    addToParams(searchParams, request, "difficulty");
    addToParams(searchParams, request, "allergens");
    addToParams(searchParams, request, "cuisines");
    addToParams(searchParams, request, "diets");
    addToParams(searchParams, request, "categories");
    const requestUrl = USER_SEARCH_URL + "?" + searchParams.toString();
    return await baseApi.sendReceiveBase<UserSearchResponse[]>(
        requestUrl,
        "SearchApi.searchUser",
        HttpMethod.GET
    );
};

const autocompleteBasicSearch = async (
    queryString: string
): Promise<FailableResponse<AutocompeletePostResponse[]>> => {
    return await baseApi.sendReceiveBase<AutocompeletePostResponse[]>(
        `${BASIC_SEARCH_AUTOCOMPLETE_URL}?keyword=${queryString}`,
        "SearchApi.autocompleteBasicSearch",
        HttpMethod.GET
    );
};

const searchApi = {
    getPreferences,
    getUserPreferences,
    getAdvancedSearchResult,
    getAdvancedSearchIngredients,
    searchPost,
    searchUser,
    autocompleteBasicSearch,
};

export default searchApi;

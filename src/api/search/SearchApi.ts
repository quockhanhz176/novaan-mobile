import BaseApi, { HttpMethod } from "../BaseApi";
import { type FailableResponse } from "../common/types/FailableResponse";
import type AdvancedSearchRecipeResponse from "./types/AdvancedSearchRecipeResponse";
import type PreferenceSuiteResponse from "./types/PreferenceSuiteResponse";

const GET_PREFERENCES_URL = "preference/all";
const ADVANCED_SEARCH_URL = "search/advanced/recipes";

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
    // let params = "";
    // ingredients.forEach((ingredients) => {
    //     params += "Ingredients=" + ingredients + "&";
    // });
    // params += "Pagination.Start=" + start.toString() + "&";
    // params += "Pagination.Limit=" + size.toString();
    return await baseApi.sendReceiveBase(
        ADVANCED_SEARCH_URL + "?" + searchParams.toString(),
        "SearchApi.getAdvancedSearchResult",
        HttpMethod.GET
    );
};

const searchApi = {
    getPreferences,
    getAdvancedSearchResult,
};

export default searchApi;

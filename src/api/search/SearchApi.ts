import BaseApi, { HttpMethod } from "../BaseApi";
import { type FailableResponse } from "../common/types/FailableResponse";
import type PreferenceSuiteResponse from "./types/PreferenceSuiteResponse";

const GET_PREFERENCES_URL = "preference/all";

const baseApi = new BaseApi();

const getPreferences = async (): Promise<FailableResponse<PreferenceSuiteResponse>> => {
    return await baseApi.sendReceiveBase(
        GET_PREFERENCES_URL,
        "SearchApi.getPreferences",
        HttpMethod.GET
    );
};

const searchApi = {
    getPreferences,
};

export default searchApi;

import BaseApi, { HttpMethod } from "../BaseApi";
import { type FailableResponse } from "../common/types/FailableResponse";
import {
    type RecommendationTipResponse,
    type RecommendationRecipeResponse,
    type RecommendationPostResponse,
} from "./types/RecommendationPostResponse";
import type RecommendationUserResponse from "./types/RecommendationUserResponse";

const TRENDING_RECIPES_URL = "content/recommendation/trending/recipe";
const TRENDING_TIPS_URL = "content/recommendation/trending/tip";
const NEWEST_POSTS_URL = "content/recommendation/newest";
const FOLLOWING_POST_URL = "content/recommendation/following";
const TRENDING_USER_URL = "content/recommendation/user";

const baseApi = new BaseApi();

const getTrendingRecipes = async (): Promise<
    FailableResponse<RecommendationRecipeResponse[]>
> => {
    return await baseApi.sendReceiveBase(
        TRENDING_RECIPES_URL,
        "recommendationApi.getTrendingRecipes",
        HttpMethod.GET
    );
};

const getTrendingTips = async (): Promise<
    FailableResponse<RecommendationTipResponse[]>
> => {
    return await baseApi.sendReceiveBase(
        TRENDING_TIPS_URL,
        "recommendationApi.getTrendingTips",
        HttpMethod.GET
    );
};

const getNewestPosts = async (): Promise<
    FailableResponse<RecommendationPostResponse[]>
> => {
    return await baseApi.sendReceiveBase(
        NEWEST_POSTS_URL,
        "recommendationApi.getNewestPosts",
        HttpMethod.GET
    );
};

const getFollowingPosts = async (): Promise<
    FailableResponse<RecommendationPostResponse[]>
> => {
    return await baseApi.sendReceiveBase(
        FOLLOWING_POST_URL,
        "recommendationApi.getFollowingPosts",
        HttpMethod.GET
    );
};

const getTrendingUsers = async (): Promise<
    FailableResponse<RecommendationUserResponse[]>
> => {
    return await baseApi.sendReceiveBase(
        TRENDING_USER_URL,
        "recommendationApi.getTrendingUsers",
        HttpMethod.GET
    );
};

const recommendationApi = {
    getTrendingRecipes,
    getTrendingTips,
    getNewestPosts,
    getFollowingPosts,
    getTrendingUsers,
};

export default recommendationApi;

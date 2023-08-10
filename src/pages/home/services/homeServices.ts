import recommendationApi from "@/api/recommendation/RecommendationApi";
import type RecommendationUserResponse from "@/api/recommendation/types/RecommendationUserResponse";
import {
    type RecommendationRecipe,
    type RecommendationPost,
    type RecommendationTip,
} from "../types/RecommendationPost";
import { type RecommendationPostResponse } from "@/api/recommendation/types/RecommendationPostResponse";

const getTrendingAuthors = async (): Promise<
    RecommendationUserResponse[] | null
> => {
    const result = await recommendationApi.getTrendingUsers();
    return result.success ? result.value : null;
};

const toRecommendationPost = (
    response: RecommendationPostResponse
): RecommendationPost => {
    return {
        cookTime: "",
        ...response,
        type: "cookTime" in response ? "recipe" : "tip",
    };
};

const getTrendingRecipes = async (): Promise<RecommendationRecipe[] | null> => {
    const result = await recommendationApi.getTrendingRecipes();
    return result.success
        ? result.value.map((value) => ({ ...value, type: "recipe" }))
        : null;
};

const getTrendingTips = async (): Promise<RecommendationTip[] | null> => {
    const result = await recommendationApi.getTrendingTips();
    return result.success
        ? result.value.map((value) => ({ ...value, type: "tip" }))
        : null;
};

const getNewestPosts = async (): Promise<RecommendationPost[] | null> => {
    const result = await recommendationApi.getNewestPosts();
    return result.success ? result.value.map(toRecommendationPost) : null;
};

const getPostsFromFollowings = async (): Promise<
    RecommendationPost[] | null
> => {
    const result = await recommendationApi.getFollowingPosts();
    return result.success ? result.value.map(toRecommendationPost) : null;
};

// const personImages = [
//     "https://unsplash.com/photos/C8Ta0gwPbQg/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM2NDA1fA&force=true",
//     "https://unsplash.com/photos/rDEOVtE7vOs/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fHx8MTY5MTUwMjk4MHww&force=true",
//     "https://unsplash.com/photos/QXevDflbl8A/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM2Mzg4fA&force=true",
//     "https://unsplash.com/photos/jmURdhtm7Ng/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM2Mzg3fA&force=true",
//     "https://unsplash.com/photos/6W4F62sN_yI/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM1MjEzfA&force=true",
//     "https://unsplash.com/photos/PQeoQdkU9jQ/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM3MjIxfA&force=true",
// ];

const foodImages = [
    "https://unsplash.com/photos/UC0HZdUitWY/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM4NjkyfA&force=true",
    "https://unsplash.com/photos/eeqbbemH9-c/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM4NjkzfA&force=true",
    "https://unsplash.com/photos/ZuIDLSz3XLg/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM2OTQ1fA&force=true",
    "https://unsplash.com/photos/MqT0asuoIcU/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM3MjM1fA&force=true",
    "https://unsplash.com/photos/Mzy-OjtCI70/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM2OTc2fA&force=true",
    "https://unsplash.com/photos/fdlZBWIP0aM/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM4Njk4fA&force=true",
    "https://unsplash.com/photos/awj7sRviVXo/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM4NzAzfA&force=true",
    "https://unsplash.com/photos/zcUgjyqEwe8/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjkxNTM4NzA0fA&force=true",
];

const getRandomPersonImageUrl = (seed: string): string => {
    // return personImages[Math.floor(Math.random() * personImages.length)];
    return `https://api.dicebear.com/6.x/thumbs/png?seed=${seed}`;
};

const getRandomFoodImageUrl = (): string => {
    return foodImages[Math.floor(Math.random() * foodImages.length)];
};

const homeServices = {
    getTrendingAuthors,
    getTrendingRecipes,
    getTrendingTips,
    getNewestPosts,
    getPostsFromFollowings,
    getRandomPersonImageUrl,
    getRandomFoodImageUrl,
};

export default homeServices;

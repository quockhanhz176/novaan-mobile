import { useState } from "react";
import { useFetch } from "../baseApiHook";
import { getKeychainValue } from "@/common/KeychainServices";
import { KEYCHAIN_ID } from "@env";
import { decode as decodeBase64 } from "base-64";
import {
    type UseProfileInfoReturn,
    type ProfileInfo,
    type GetUserRecipeReturn,
} from "./types";
import { type RecipeInfo } from "../post/types/post.type";

const PAGE_SIZE = 10;

const parseJwt = (token: string): any => {
    const base64Url = token.split(".")[1];
    const jsonPayload = decodeBase64(base64Url);
    return JSON.parse(jsonPayload);
};

const getUserIdFromToken = async (): Promise<string> => {
    const token = await getKeychainValue(KEYCHAIN_ID);
    const payload = parseJwt(token);
    if (payload == null || typeof payload === "string") {
        throw new Error();
    }

    return payload.nameid;
};

export const useProfileInfo = (): UseProfileInfoReturn => {
    const { getReq } = useFetch({ authorizationRequired: true });

    const [profileInfo, setProfileInfo] = useState<ProfileInfo>();

    // Use boolean to indicate if the call was success or not
    const fetchPersonalProfile = async (): Promise<boolean> => {
        try {
            const currentUserId = await getUserIdFromToken();
            const profileResponse = await getReq(`profile/${currentUserId}`);
            if (profileResponse == null || !("id" in profileResponse)) {
                return false;
            }

            setProfileInfo(profileResponse);
        } catch {
            return false;
        }

        return true;
    };

    // Use boolean to indicate if the call was success or not
    const fetchUserProfile = async (userId: string): Promise<boolean> => {
        const profileResponse = await getReq(`profile/${userId}`);
        if (profileResponse == null || !("id" in profileResponse)) {
            return false;
        }
        setProfileInfo(profileResponse);
        return true;
    };

    return { profileInfo, fetchUserProfile, fetchPersonalProfile };
};

export const useUserRecipes = (userId?: string): GetUserRecipeReturn => {
    const { getReq } = useFetch({ authorizationRequired: true });

    // Indicate if the result is empty
    const [isEmpty, setIsEmpty] = useState(false);

    const [recipes, setRecipes] = useState<RecipeInfo[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const getRecipes = async (
        start: number,
        limit: number
    ): Promise<boolean> => {
        if (userId == null) {
            userId = await getUserIdFromToken();
        }

        const content = (await getReq(
            `profile/${userId}/recipes?Start=${start}&Limit=${limit}`
        )) as RecipeInfo[];

        if (content == null) {
            return false;
        }

        if (start === 0 && content.length === 0) {
            setIsEmpty(true);
            return true;
        }

        // TODO: Need to have a mechanism to auto remove viewed content above and re-query as needed
        // Spread operator to mutate array become more expensive as the array become bigger
        setRecipes((recipes) => [...recipes, ...content]);
        return true;
    };

    const getNext = async (): Promise<boolean> => {
        // Avoid re-fetching data
        if (isEmpty) {
            return true;
        }

        const start = currentPage * PAGE_SIZE;
        if (start < recipes.length) {
            return true;
        }

        setCurrentPage((page) => page + 1);
        return await getRecipes(start, PAGE_SIZE);
    };

    const getPrev = async (): Promise<boolean> => {
        if (isEmpty) {
            return true;
        }

        const start = (currentPage - 1) * PAGE_SIZE;
        if (start < 0) {
            return true;
        }

        setCurrentPage((page) => page - 1);
        return await getRecipes(start, PAGE_SIZE);
    };

    const getPage = (pageNumber: number): RecipeInfo[] => {
        const start = pageNumber * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        if (start >= recipes.length) {
            throw new Error("Page number out of bound");
        }
        if (end >= recipes.length) {
            return recipes.slice(start);
        }

        return recipes.slice(start, end);
    };

    return { getNext, getPrev, getPage, recipes };
};

// TODO: Implement this later
// export const useUserTips = () => {};

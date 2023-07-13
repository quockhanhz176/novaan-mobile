import { useState } from "react";
import { useFetch } from "../baseApiHook";
import { KEYCHAIN_ID } from "@env";
import { decode as decodeBase64 } from "base-64";
import {
    type UseProfileInfoReturn,
    type ProfileInfo,
    type GetUserRecipeReturn,
    type GetUserTipReturn,
} from "./types";
import { getKeychainValue } from "@/common/keychainService";
import {
    type TipResponse,
    type RecipeResponse,
} from "../post/types/PostResponse";

const PAGE_SIZE = 4;

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

    const [ended, setEnded] = useState(false);
    const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
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
        )) as RecipeResponse[];

        if (content == null) {
            return false;
        }

        if (content.length === 0 || content.length < PAGE_SIZE) {
            setEnded(true);
        }

        // TODO: Need to have a mechanism to auto remove viewed content above and re-query as needed
        // Spread operator to mutate array become more expensive as the array become bigger
        setRecipes((recipes) => [...recipes, ...content]);
        return true;
    };

    const getNext = async (): Promise<boolean> => {
        // Avoid re-fetching data
        if (ended) {
            return true;
        }

        const start = currentPage * PAGE_SIZE;
        if (start < recipes.length) {
            return true;
        }

        setCurrentPage((page) => page + 1);
        return await getRecipes(start, PAGE_SIZE);
    };

    const refresh = (): void => {
        setEnded(false);
        setRecipes([]);
        setCurrentPage(0);
    };

    return { getNext, refresh, recipes, ended };
};

export const useUserTips = (userId?: string): GetUserTipReturn => {
    const { getReq } = useFetch({ authorizationRequired: true });

    const [ended, setEnded] = useState(false);
    const [tips, setTips] = useState<TipResponse[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const getTips = async (start: number, limit: number): Promise<boolean> => {
        if (userId == null) {
            userId = await getUserIdFromToken();
        }

        const content = (await getReq(
            `profile/${userId}/tips?Start=${start}&Limit=${limit}`
        )) as TipResponse[];

        if (content == null) {
            return false;
        }

        if (content.length === 0 || content.length < PAGE_SIZE) {
            setEnded(true);
        }

        // TODO: Need to have a mechanism to auto remove viewed content above and re-query as needed
        // Spread operator to mutate array become more expensive as the array become bigger
        setTips((tips) => [...tips, ...content]);
        return true;
    };

    const getNext = async (): Promise<boolean> => {
        // Avoid re-fetching data
        if (ended) {
            return true;
        }

        const start = currentPage * PAGE_SIZE;
        if (start < tips.length) {
            return true;
        }

        setCurrentPage((page) => page + 1);
        return await getTips(start, PAGE_SIZE);
    };

    const refresh = (): void => {
        setEnded(false);
        setTips([]);
        setCurrentPage(0);
    };

    return { getNext, refresh, tips, ended };
};

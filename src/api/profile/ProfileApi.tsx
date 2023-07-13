import { useState } from "react";
import { useFetch } from "../baseApiHook";
import { KEYCHAIN_ID } from "@env";
import { decode as decodeBase64 } from "base-64";
import {
    type UseProfileInfoReturn,
    type ProfileInfo,
    type GetUserRecipeReturn,
    type GetUserTipReturn,
    type GetUserContentHookReturn,
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

const useGetContent = (
    contentType: "recipes" | "tips",
    userId?: string
): GetUserContentHookReturn => {
    const { getReq } = useFetch({ authorizationRequired: true });

    const [ended, setEnded] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const getContent = async <T,>(
        start: number,
        limit: number
    ): Promise<T[]> => {
        if (userId == null) {
            userId = await getUserIdFromToken();
        }

        const content = (await getReq(
            `profile/${userId}/${contentType}?Start=${start}&Limit=${limit}`
        )) as T[];

        if (content.length === 0 || content.length < PAGE_SIZE) {
            setEnded(true);
        }

        return content;
    };

    const getNext = async <T,>(): Promise<T[]> => {
        // Avoid re-fetching data
        if (ended) {
            return [];
        }

        const start = currentPage * PAGE_SIZE;
        setCurrentPage((page) => page + 1);
        return await getContent<T>(start, PAGE_SIZE);
    };

    const refresh = (): void => {
        setEnded(false);
        setCurrentPage(0);
    };

    return { getContent, getNext, refresh, ended };
};

export const useUserRecipes = (userId?: string): GetUserRecipeReturn => {
    const {
        ended,
        getNext: getNextRecipes,
        refresh: refreshContent,
    } = useGetContent("recipes", userId);

    const [recipes, setRecipes] = useState<RecipeResponse[]>([]);

    const getNext = async (): Promise<boolean> => {
        if (ended) {
            return true;
        }

        const content = await getNextRecipes<RecipeResponse>();
        if (content == null) {
            return false;
        }

        setRecipes([...recipes, ...content]);
        return true;
    };

    const refresh = (): void => {
        refreshContent();
        setRecipes([]);
    };

    return { getNext, refresh, recipes, ended };
};

export const useUserTips = (userId?: string): GetUserTipReturn => {
    const {
        ended,
        getNext: getNextTips,
        refresh: refreshContent,
    } = useGetContent("tips", userId);

    const [tips, setTips] = useState<TipResponse[]>([]);

    const getNext = async (): Promise<boolean> => {
        if (ended) {
            return true;
        }

        const content = await getNextTips<TipResponse>();
        if (content == null) {
            return false;
        }

        setTips([...tips, ...content]);
        return true;
    };

    const refresh = (): void => {
        refreshContent();
        setTips([]);
    };

    return { getNext, refresh, tips, ended };
};

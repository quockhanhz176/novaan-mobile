import { useState } from "react";
import { useFetch } from "../baseApiHook";
import { KEYCHAIN_ID } from "@env";
import { decode as decodeBase64 } from "base-64";
import {
    type UseProfileInfoReturn,
    type ProfileInfo,
    type MinimalUserInfo,
} from "./types";
import { getKeychainValue } from "@/common/keychainService";
import {
    type TipResponse,
    type RecipeResponse,
} from "../post/types/PostResponse";
import { type PaginationHookReturn } from "../common/types/PaginationHook";

const PAGE_SIZE = 4;

const parseJwt = (token: string): any => {
    const base64Url = token.split(".")[1];
    const jsonPayload = decodeBase64(base64Url);
    return JSON.parse(jsonPayload);
};

export const getUserIdFromToken = async (): Promise<string> => {
    const token = await getKeychainValue(KEYCHAIN_ID);
    const payload = parseJwt(token);
    if (payload == null || typeof payload === "string") {
        throw new Error();
    }

    return payload.nameid;
};

export const useProfileInfo = (): UseProfileInfoReturn => {
    const { getReq } = useFetch({
        authorizationRequired: true,
        timeout: 10000,
    });

    const [profileInfo, setProfileInfo] = useState<ProfileInfo>();

    // Use boolean to indicate if the call was success or not
    const fetchPersonalProfile = async (): Promise<boolean> => {
        try {
            const currentUserId = await getUserIdFromToken();
            const profileResponse = await getReq(`profile/${currentUserId}`);
            if (
                typeof profileResponse !== "object" ||
                profileResponse == null ||
                !("id" in profileResponse)
            ) {
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
        if (
            typeof profileResponse !== "object" ||
            profileResponse == null ||
            !("id" in profileResponse)
        ) {
            return false;
        }
        setProfileInfo(profileResponse);
        return true;
    };

    return { profileInfo, fetchUserProfile, fetchPersonalProfile };
};

const useGetUserContent = <T,>(
    getContentUrl: (userId: string) => Promise<string>,
    userId?: string
): PaginationHookReturn<T> => {
    const { getReq } = useFetch({
        authorizationRequired: true,
        timeout: 10000,
    });

    const [ended, setEnded] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [content, setContent] = useState<T[]>([]);

    const getContent = async <T,>(
        start: number,
        limit: number
    ): Promise<T[]> => {
        if (userId == null) {
            userId = await getUserIdFromToken();
        }
        const contentUrl = await getContentUrl(userId);
        const content = (await getReq(
            `${contentUrl}?Start=${start}&Limit=${limit}`
        )) as T[];

        if (content == null) {
            setEnded(true);
            return [];
        }

        if (content.length === 0 || content.length < PAGE_SIZE) {
            setEnded(true);
        }

        return content;
    };

    const getNext = async (): Promise<void> => {
        // Avoid re-fetching data
        if (ended) {
            return;
        }

        const start = currentPage * PAGE_SIZE;
        setCurrentPage((page) => page + 1);

        const newContent = await getContent<T>(start, PAGE_SIZE);
        if (newContent.length <= 0) {
            return;
        }

        setContent([...content, ...newContent]);
    };

    const refresh = (): void => {
        setEnded(false);
        setCurrentPage(0);
        setContent([]);
    };

    return { getNext, refresh, content, ended };
};

export const useUserRecipes = (
    userId?: string
): PaginationHookReturn<RecipeResponse> => {
    const getContentUrl = async (userId: string): Promise<string> => {
        return `profile/${userId}/recipes`;
    };

    return useGetUserContent<RecipeResponse>(getContentUrl, userId);
};

export const useUserTips = (
    userId?: string
): PaginationHookReturn<TipResponse> => {
    const getContentUrl = async (userId: string): Promise<string> => {
        return `profile/${userId}/tips`;
    };

    return useGetUserContent<TipResponse>(getContentUrl, userId);
};

export const useUserFollowing = (
    userId?: string
): PaginationHookReturn<MinimalUserInfo> => {
    const getContentUrl = async (userId: string): Promise<string> => {
        return `following/${userId}`;
    };

    return useGetUserContent<MinimalUserInfo>(getContentUrl, userId);
};

export const useUserFollower = (
    userId?: string
): PaginationHookReturn<MinimalUserInfo> => {
    const getContentUrl = async (userId: string): Promise<string> => {
        return `followers/${userId}`;
    };

    return useGetUserContent<MinimalUserInfo>(getContentUrl, userId);
};

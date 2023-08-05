import { useEffect, useMemo, useState } from "react";
import { useFetch, useFetchSwr } from "../baseApiHook";
import {
    type UseProfileInfoReturn,
    type ProfileInfo,
    type MinimalUserInfo,
    type SavedPostResponse,
    type UseAppPreferenceReturn,
    type UserPreferences,
    type UseUserPreferencesReturn,
} from "./types";
import {
    type TipResponse,
    type RecipeResponse,
} from "../post/types/PostResponse";
import { type PaginationHookReturn } from "../common/types/PaginationHook";
import { getUserIdFromToken } from "../common/utils/TokenUtils";
import type PreferenceSuiteResponse from "../search/types/PreferenceSuiteResponse";
import PreferenceSuite from "@/pages/search/types/PreferenceSuite";
import { responseObjectValid } from "../common/utils/ResponseUtils";
import type PreferenceResponse from "../search/types/PreferenceResponse";
import { getData, storeData } from "@/common/AsyncStorageService";
import moment from "moment";
import { Undefinable } from "@/types/app";

const PAGE_SIZE = 4;

const GET_PREFERENCES_URL = "preference/all";
const USER_PREFRENCES_URL = "preference/me";

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
    getContentUrl: (userId: string) => string,
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
        const contentUrl = getContentUrl(userId);
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

export const getUserRecipesUrl = (userId: string): string => {
    return `profile/${userId}/recipes`;
};

export const getUserTipsUrl = (userId: string): string => {
    return `profile/${userId}/tips`;
};

export const getUserFollowingUrl = (userId: string): string => {
    return `following/${userId}`;
};

export const getUserFollowerUrl = (userId: string): string => {
    return `followers/${userId}`;
};

export const getUserSavedUrl = (userId: string): string => {
    return `profile/${userId}/saved`;
};

export const useUserRecipes = (
    userId?: string
): PaginationHookReturn<RecipeResponse> => {
    return useGetUserContent<RecipeResponse>(getUserRecipesUrl, userId);
};

export const useUserTips = (
    userId?: string
): PaginationHookReturn<TipResponse> => {
    return useGetUserContent<TipResponse>(getUserTipsUrl, userId);
};

export const useUserFollowing = (
    userId?: string
): PaginationHookReturn<MinimalUserInfo> => {
    return useGetUserContent<MinimalUserInfo>(getUserFollowingUrl, userId);
};

export const useUserFollower = (
    userId?: string
): PaginationHookReturn<MinimalUserInfo> => {
    return useGetUserContent<MinimalUserInfo>(getUserFollowerUrl, userId);
};

export const useUserSavedPost = (
    userId?: string
): PaginationHookReturn<SavedPostResponse> => {
    if (userId == null) {
        return {
            content: [],
            ended: false,
            getNext: () => {},
            refresh: () => {},
        };
    }

    const [ended, setEnded] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [content, setContent] = useState<SavedPostResponse[]>([]);

    const queryParams = useMemo(
        () => `?Start=0&Limit=${(currentPage + 1) * PAGE_SIZE}`,
        [currentPage]
    );

    const { data } = useFetchSwr([getUserSavedUrl(userId), queryParams], {
        authorizationRequired: true,
        timeout: 10000,
    });

    useEffect(() => {
        console.log(data);

        if (data == null) {
            setEnded(true);
            return;
        }

        if (data.length === 0 || data.length < PAGE_SIZE) {
            setEnded(true);
        }
        setContent(data);
    }, [data]);

    const getNext = async (): Promise<void> => {
        // Avoid re-fetching data
        if (ended) {
            return;
        }
        setCurrentPage((page) => page + 1);
    };

    const refresh = (): void => {
        setEnded(false);
        setCurrentPage(0);
        setContent([]);
    };

    return { getNext, refresh, content, ended };
    // return useGetUserContent<SavedPostResponse>(getUserSavedUrl, userId);
};

// For getting available preferences
export const useAppPreferences = (): UseAppPreferenceReturn => {
    const { getReq } = useFetch({ authorizationRequired: true });

    const [diets, setDiets] = useState<PreferenceResponse[]>([]);
    const [cuisines, setCuisines] = useState<PreferenceResponse[]>([]);
    const [allergens, setAllergens] = useState<PreferenceResponse[]>([]);

    const getAllPreferenceOptions = async (): Promise<boolean> => {
        const cachePreference = await loadCachePreference();
        if (cachePreference != null) {
            const { diets, cuisines, allergens } = cachePreference;
            setDiets(diets);
            setCuisines(cuisines);
            setAllergens(allergens);
            return true;
        }

        const response = await getReq(GET_PREFERENCES_URL);
        if (!responseObjectValid(response)) {
            return false;
        }

        const { diets, cuisines, allergens } =
            response as PreferenceSuiteResponse;
        setDiets(diets);
        setCuisines(cuisines);
        setAllergens(allergens);

        await saveCachePreference(response);
        return true;
    };

    const saveCachePreference = async (
        data: PreferenceSuiteResponse
    ): Promise<void> => {
        // Store data with expiration set to 1 days after current timestamp
        await storeData("preferenceData", {
            ...data,
            exp: moment().add(1, "day").unix(),
        });
    };

    const loadCachePreference =
        async (): Promise<PreferenceSuiteResponse | null> => {
            const cache = await getData("preferenceData");
            if (cache == null) {
                return null;
            }

            // Check exp
            const isExpired = moment().diff(moment.unix(cache.exp)) >= 0;
            if (isExpired) {
                return null;
            }

            return {
                diets: cache.diets,
                cuisines: cache.cuisines,
                allergens: cache.allergens,
            };
        };

    return { diets, cuisines, allergens, getAllPreferenceOptions };
};

// For getting + setting current user preferences
export const useUserPreferences = (): UseUserPreferencesReturn => {
    const { getReq, putReq } = useFetch({ authorizationRequired: true });

    const getUserPreferences = async (): Promise<UserPreferences> => {
        const cacheUserPreferences = await loadUserPreference();
        if (cacheUserPreferences != null) {
            return cacheUserPreferences;
        }

        const response = await getReq(USER_PREFRENCES_URL);
        if (!responseObjectValid(response)) {
            throw new Error(); // For UI to handle however they like
        }

        await storeUserPreference(response);
        return response;
    };

    // For when user skip first-time preferences setting
    const setEmptyUserPreferences = async (): Promise<boolean> => {
        const payload: UserPreferences = {
            diets: [],
            cuisines: [],
            allergens: [],
        };

        return await setUserPreferences(payload);
    };

    // For setting/updating preferences
    const setUserPreferences = async (
        preferences: UserPreferences
    ): Promise<boolean> => {
        const response = await putReq(USER_PREFRENCES_URL, preferences);
        if (!responseObjectValid(response)) {
            return false;
        }

        return true;
    };

    const storeUserPreference = async (
        preferences: UserPreferences
    ): Promise<void> => {
        await storeData("userPreferenceData", {
            ...preferences,
            exp: moment().add(12, "hours").unix(),
        });
    };

    const loadUserPreference = async (): Promise<UserPreferences | null> => {
        const cache = await getData("userPreferenceData");
        if (cache == null) {
            return null;
        }

        // Check exp
        const isExpired = moment().diff(moment.unix(cache.exp)) >= 0;
        if (isExpired) {
            return null;
        }

        return {
            diets: cache.diets,
            cuisines: cache.cuisines,
            allergens: cache.allergens,
        };
    };

    return { getUserPreferences, setEmptyUserPreferences, setUserPreferences };
};

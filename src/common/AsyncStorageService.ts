import type PostListResponse from "@/api/post/types/PostListResponse";
import { type ProfileInfo, type UserPreferences } from "@/api/profile/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Moment } from "moment";
import { type WithExp } from "./utils";
import { type AllPreferenceResponse } from "@/api/profile/types/preference.type";

export interface StorageKey {
    reelListData: {
        list: PostListResponse;
        lastItem: number;
        lastUpdate: Moment;
    };
    reelsData: {
        data: PostListResponse;
        exp: number;
    };
    preferenceData: WithExp<AllPreferenceResponse>;
    userPreferenceData: WithExp<UserPreferences>;
    haveUserSetPreference: boolean;
    userProfile: ProfileInfo;
}

export const storeData = async <T extends keyof StorageKey>(
    key: T,
    value: StorageKey[T] | null
): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(e);
    }
};

export const getData = async <T extends keyof StorageKey>(
    key: T
): Promise<StorageKey[T] | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null && jsonValue !== ""
            ? JSON.parse(jsonValue)
            : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const invalidateData = async <T extends keyof StorageKey>(
    key: T
): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch {
        // Ignore error
    }
};

export const unsafeStoreData = async (
    key: string,
    value: WithExp<object>
): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(e);
    }
};

export const unsafeLoadData = async <T>(
    key: string
): Promise<WithExp<T> | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null && jsonValue !== ""
            ? JSON.parse(jsonValue)
            : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const unsafeInvalidateData = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch {
        // Ignore error
    }
};

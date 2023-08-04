import type PostListResponse from "@/api/post/types/PostListResponse";
import type PreferenceSuiteResponse from "@/api/search/types/PreferenceSuiteResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Moment } from "moment";

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
    preferenceData: PreferenceSuiteResponse;
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

import type PostResponse from "@/api/post/types/PostResponse";
import { type Undefinable } from "@/types/app";
import { type AllPreferenceResponse } from "./preference.type";
import { type PostStatus } from "@/api/post/types/PostResponse";

export interface Followership {
    id: string;
    followerId: string;
    followingId: string;
}

export interface ProfileInfo {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    postCount: number;
    followerships: Followership[];
}

export interface UseProfileInfoReturn {
    profileInfo: Undefinable<ProfileInfo>;
    fetchPersonalProfile: () => Promise<boolean>;
    fetchUserProfile: (userId: string) => Promise<boolean>;
}

export interface MinimalUserInfo {
    username: string;
    id: string;
    avatar: string;
}

export interface SavedPostResponse {
    id: string;
    postTitle: string;
    postType: "Recipe" | "CulinaryTip";
}

export type MinimalPostInfo = Pick<PostResponse, "id" | "type" | "title"> & {
    status?: PostStatus;
    thumbnail?: string;
};

export interface UseAppPreferenceReturn extends AllPreferenceResponse {
    getAllPreferenceOptions: () => Promise<boolean>;
}

export interface UseUserPreferencesReturn {
    getUserPreferences: () => Promise<UserPreferences>;
    setEmptyUserPreferences: () => Promise<boolean>;
    setUserPreferences: (preferences: UserPreferences) => Promise<boolean>;
    haveUserSetPreference: () => Promise<boolean>;
}

export interface UserPreferences {
    diets: string[];
    cuisines: string[];
    allergens: string[];
}

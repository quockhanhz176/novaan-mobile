import type PostResponse from "@/api/post/types/PostResponse";
import type PreferenceSuiteResponse from "@/api/search/types/PreferenceSuiteResponse";
import { type Undefinable } from "@/types/app";

export interface Followership {
    id: string;
    followerId: string;
    followingId: string;
}

export interface ProfileInfo {
    id: string;
    username: string;
    userId: string;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    avatar: string;
    followerships: Followership[];
}

export interface UseProfileInfoReturn {
    profileInfo: Undefinable<ProfileInfo>;
    fetchPersonalProfile: () => Promise<boolean>;
    fetchUserProfile: (userId: string) => Promise<boolean>;
}

export interface MinimalUserInfo {
    username: string;
    userId: string;
    avatar: string;
}

export interface SavedPostResponse {
    postId: string;
    postTitle: string;
    postType: "Recipe" | "CulinaryTip";
}

export type MinimalPostInfo = Pick<PostResponse, "id" | "type" | "title">;

export interface UseAppPreferenceReturn extends PreferenceSuiteResponse {
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

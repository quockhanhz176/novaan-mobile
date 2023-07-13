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

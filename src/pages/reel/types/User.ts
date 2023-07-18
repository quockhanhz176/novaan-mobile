interface User {
    username: string;
    userId: string;
    isFollowing?: boolean;
    followersCount?: number;
    followingCount?: number;
    avatar?: string;
}

export default User;

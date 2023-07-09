interface User {
    username: string;
    userId: string;
    isFollowing?: true;
    followersCount?: 0;
    followingCount?: 0;
    avatarUri?: string;
}

export default User;

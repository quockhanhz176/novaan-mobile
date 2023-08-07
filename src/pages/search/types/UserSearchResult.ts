import type UserSearchResponse from "@/api/search/types/UserSearchResponse";

type UserSearchResult = UserSearchResponse & {
    followed: boolean;
};

export default UserSearchResult;

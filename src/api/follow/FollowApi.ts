import { type MinimalUserInfo } from "../profile/types";
import { getUserIdFromToken } from "../common/utils/TokenUtils";
import { type FailableResponse } from "../common/types/FailableResponse";
import BaseApi, { HttpMethod } from "../BaseApi";

const FOLLOWER_LIST_URL = "followers";
const FOLLOWING_LIST_URL = "following";
const FOLLOW_URL = "follow";
const UNFOLLOW_URL = "unfollow";

const baseApi = new BaseApi();

const getFollowers = async (
    userId?: string
): Promise<FailableResponse<MinimalUserInfo[]>> => {
    const id = userId ?? (await getUserIdFromToken());
    return await baseApi.sendReceiveBase<MinimalUserInfo[]>(
        FOLLOWER_LIST_URL + "/" + id,
        "FollowApi.getFollowers",
        HttpMethod.GET
    );
};

const getFollowings = async (
    userId?: string
): Promise<FailableResponse<MinimalUserInfo[]>> => {
    const id = userId ?? (await getUserIdFromToken());
    return await baseApi.sendReceiveBase<MinimalUserInfo[]>(
        FOLLOWING_LIST_URL + "/" + id,
        "FollowApi.getFollowings",
        HttpMethod.GET
    );
};

const setFollow = async (
    userId: string,
    value: boolean
): Promise<FailableResponse<undefined>> => {
    return await baseApi.sendReceiveBase<undefined>(
        (value ? FOLLOW_URL : UNFOLLOW_URL) + "/" + userId,
        "FollowApi.setFollow",
        HttpMethod.POST
    );
};

const followApi = {
    getFollowers,
    getFollowings,
    setFollow,
};

export default followApi;

import { getUserIdFromToken } from "@/api/common/utils/TokenUtils";
import postApi from "@/api/post/PostApi";
import { type ProfileInfo } from "@/api/profile/types";
import { getData } from "@/common/AsyncStorageService";

let cachedUserProfile: ProfileInfo | undefined;

const getUserProfile = async (): Promise<ProfileInfo | undefined> => {
    if (cachedUserProfile != null) {
        return cachedUserProfile;
    }

    try {
        const profileInfo = await getData("userProfile");
        if (profileInfo != null) {
            cachedUserProfile = profileInfo;
            return profileInfo;
        }

        const id = await getUserIdFromToken();
        const profileResponse = await postApi.getProfile(id);
        if (!profileResponse.success) {
            return undefined;
        }
        cachedUserProfile = profileResponse.value;
        return profileResponse.value;
    } catch (e) {
        return undefined;
    }
};

const userProfileServices = {
    getUserProfile,
    cachedUserProfile,
};

export default userProfileServices;

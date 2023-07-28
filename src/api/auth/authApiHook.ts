import { type Undefinable } from "@/types/app";
import { useFetch } from "../baseApiHook";
import { responseObjectValid } from "../common/utils/ResponseUtils";
import { type UseRefreshTokenReturn } from "./types/hook.type";

const REFRESH = "auth/refreshtoken";

export const useRefreshToken = (): UseRefreshTokenReturn => {
    const { postReq } = useFetch({ authorizationRequired: true });

    const refreshToken = async (): Promise<Undefinable<string>> => {
        const newTokenResponse = await postReq(REFRESH, {});
        if (!responseObjectValid(newTokenResponse)) {
            return undefined;
        }
        if (!("token" in newTokenResponse)) {
            return undefined;
        }

        return newTokenResponse.token;
    };

    return { refreshToken };
};

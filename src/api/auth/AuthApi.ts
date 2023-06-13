import BaseApi from "../BaseApi";
import type SignInRequest from "./types/SignInRequest";
import type SignInResponse from "./types/SignInResponse";

const SIGNIN_URL = "auth/signin";

const baseApi = new BaseApi();

const signIn = async (
    usernameOrEmail: string,
    password: string
): Promise<SignInResponse> => {
    return await baseApi.post<SignInRequest, SignInResponse>(SIGNIN_URL, {
        usernameOrEmail,
        password,
    });
};

const signUp = async (
    usernameOrEmail: string,
    password: string
): Promise<SignInResponse> => {
    return await baseApi.post<SignInRequest, SignInResponse>(SIGNIN_URL, {
        usernameOrEmail,
        password,
    });
};

const authApi = {
    signIn,
    signUp,
};

export default authApi;

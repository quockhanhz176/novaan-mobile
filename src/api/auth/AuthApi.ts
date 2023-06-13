import BaseApi from "../BaseApi";
import {
    type SignInResponse,
    type SignInRequest,
    type SignUpRequest,
    type SignUpResponse,
} from "./types";

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
    return await baseApi.post<SignUpRequest, SignUpResponse>(SIGNIN_URL, {
        usernameOrEmail,
        password,
    });
};

const authApi = {
    signIn,
    signUp,
};

export default authApi;

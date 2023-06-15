import BaseApi from "../BaseApi";
import {
    type SignInResponse,
    type SignInRequest,
    type SignUpRequest,
    type SignUpResponse,
} from "./types";

const SIGN_IN_URL = "auth/signin";
const SIGN_UP_URL = "auth/signup";
const SIGN_UP_EMAIL_EXIST_ERROR =
    "This email had been associated with another account.";
const SIGN_UP_USERNAME_EXIST_ERROR =
    "This username had been associated with another account.";

const baseApi = new BaseApi();

const signIn = async (
    usernameOrEmail: string,
    password: string
): Promise<SignInResponse> => {
    const response = await baseApi.post<SignInRequest>(SIGN_IN_URL, {
        usernameOrEmail,
        password,
    });
    return await response.json();
};

const signUp = async (
    username: string,
    email: string,
    password: string
): Promise<SignUpResponse> => {
    const response = await baseApi.post<SignUpRequest>(SIGN_UP_URL, {
        username,
        password,
        email,
    });
    if (!response.ok) {
        const responseBody: null | {
            Success: boolean;
            Body: { Message: string };
        } = await response.json();
        const message = responseBody?.Body.Message;
        return {
            success: false,
            reason:
                message === SIGN_UP_EMAIL_EXIST_ERROR
                    ? "email exists"
                    : message === SIGN_UP_USERNAME_EXIST_ERROR
                    ? "username exists"
                    : "unknown",
        };
    }

    return {
        success: true,
    };
};

const authApi = {
    signIn,
    signUp,
};

export default authApi;

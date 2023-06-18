import BaseApi from "../BaseApi";
import {
    type SignInResponse,
    type SignInRequest,
    type SignUpRequest,
    type SignUpResponse,
    type SignInGoogleRequest,
    type SignUpErrReason,
} from "./types";

const SIGN_IN_URL = "auth/signin";
const SIGN_UP_URL = "auth/signup";
const SIGNIN_GOOGLE_URL = "auth/google";

// TODO: Change this to error code later
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
    displayName: string,
    email: string,
    password: string
): Promise<SignUpResponse> => {
    const response = await baseApi.post<SignUpRequest>(SIGN_UP_URL, {
        displayName,
        password,
        email,
    });

    if (!response.ok) {
        const body = await response.json();
        const message = body?.body.message;

        // TODO: Change this to error code later
        let errMessage: SignUpErrReason = "unknown";
        switch (message) {
            case SIGN_UP_EMAIL_EXIST_ERROR:
                errMessage = "email exists";
                break;
            case SIGN_UP_USERNAME_EXIST_ERROR:
                errMessage = "username exists";
                break;
        }
        return {
            success: false,
            reason: errMessage,
        };
    }
    return {
        success: true,
    };
};

const signInWithGoogle = async (token: string): Promise<SignInResponse> => {
    try {
        const response = await baseApi.post<SignInGoogleRequest>(
            SIGNIN_GOOGLE_URL,
            {
                token,
            }
        );
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch (err) {
        console.log("Sign in with Google ERR", err);
        throw err;
    }
};

const authApi = {
    signIn,
    signUp,
    signInWithGoogle,
};

export default authApi;

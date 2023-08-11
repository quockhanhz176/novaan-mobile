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
const SIGN_UP_EMAIL_EXIST_ERROR_CODE = 1004;
const SIGN_UP_USERNAME_EXIST_ERROR =
    "This username had been associated with another account.";

const baseApi = new BaseApi();

const signIn = async (
    email: string,
    password: string
): Promise<SignInResponse> => {
    const response = await baseApi.post<SignInRequest>(SIGN_IN_URL, {
        email,
        password,
    });
    const body = await response.json();

    if (!response.ok) {
        const code: number = body.code;
        return {
            success: false,
            code,
        };
    }

    return {
        success: true,
        token: body.token,
    };
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
    console.log("AuthApi.signUp - response", JSON.stringify(response));

    if (!response.ok) {
        const body = await response.json();
        console.log("AuthApi.signUp - body", JSON.stringify(body));
        const errorCode = body?.errCode;

        // TODO: Change this to error code later
        let errMessage: SignUpErrReason = "unknown";
        switch (errorCode) {
            case SIGN_UP_EMAIL_EXIST_ERROR_CODE:
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
            },
            {
                timeout: 30000,
                authorizationRequired: false,
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

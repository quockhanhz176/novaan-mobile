import { API_URL, API_TIMEOUT, KEYCHAIN_ID } from "@env";
import { useNavigation } from "@react-navigation/core";
import UnauthorizedError from "./errors/Unauthorized";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getKeychainValue, saveKeychain } from "@/common/keychainService";
import { type RootStackParamList } from "@/types/navigation";
import { responseObjectValid } from "./common/utils/ResponseUtils";
import { type Undefinable } from "@/types/app";
import { getPayloadFromToken } from "./common/utils/TokenUtils";
import useSwr, { type Key, type SWRResponse } from "swr";

// GLOBAL IN-MEMORY VARIABLE (DO NOT TOUCH)
let tokenExpTimestamp: number = -1;
let currentToken = "";

interface RequestConfig {
    timeout?: number;
    authorizationRequired?: boolean;
    contentType?: string;
    needJsonBody?: boolean;
}

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

type ApiRequest = (url: string) => Promise<any>;
type ApiRequestWithBody = (url: string, body: any) => Promise<any>;

const REFRESH = "auth/refreshtoken";

export interface TokenPayload {
    nameid: string;
    urole: string;
    iat: string;
    nbf: string;
    exp: string;
}

interface UseFetchReturn {
    getReq: ApiRequest;
    postReq: ApiRequestWithBody;
    putReq: ApiRequestWithBody;
    deleteReq: ApiRequest;
}

const getDefaultConfig = (): RequestConfig => {
    return {
        timeout: Number(API_TIMEOUT),
        authorizationRequired: false,
        contentType: "application/json",
        needJsonBody: true,
    };
};

export const sendBaseRequest = async (
    url: string,
    method: HttpMethod,
    config?: RequestConfig,
    body?: any
): Promise<Response> => {
    config = { ...getDefaultConfig(), ...config };

    const getHeaders = async (): Promise<Headers> => {
        const headers = new Headers();
        if (config?.contentType == null) {
            headers.append("Content-Type", "application/json");
        } else {
            headers.append("Content-Type", config.contentType);
        }
        headers.append("Accept", "application/json");
        headers.append(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );

        if (
            config?.authorizationRequired != null &&
            config.authorizationRequired
        ) {
            if (currentToken === "") {
                currentToken = await getKeychainValue(KEYCHAIN_ID);
                if (currentToken == null) {
                    throw new Error("Access token not found");
                }
            }

            currentToken = await getNewTokenIfExpired(currentToken);

            headers.append("Authorization", `Bearer ${currentToken}`);
        }

        return headers;
    };

    const getNewTokenIfExpired = async (
        currentToken: string
    ): Promise<string> => {
        let exp = tokenExpTimestamp;

        // If there are no cache exp, read exp from currentToken (and cache that)
        if (exp < 0) {
            const tokenPayload = await getPayloadFromToken<TokenPayload>(
                currentToken
            );

            if (tokenPayload.exp == null) {
                throw new UnauthorizedError("Access token not valid");
            }
            exp = Number(tokenPayload.exp);
            tokenExpTimestamp = exp;
        }

        if (isTimestampExpired(exp)) {
            // Try to refresh token
            const newToken = await refreshToken(currentToken);
            if (newToken == null) {
                throw new UnauthorizedError("Failed to refresh current token");
            }

            // Save new token into keychain store
            await saveKeychain(KEYCHAIN_ID, newToken);

            // Cache new token exp into device memory
            const newPayload = await getPayloadFromToken<TokenPayload>(
                newToken
            );

            tokenExpTimestamp = Number(newPayload.exp);

            return newToken;
        }

        // Return currentToken if it is still usable
        return currentToken;
    };

    const refreshToken = async (
        oldToken: string
    ): Promise<Undefinable<string>> => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        headers.append("Authorization", `Bearer ${oldToken}`);

        const response = await fetch(`${API_URL}${REFRESH}`, {
            headers,
            body: "{}",
            method: "POST",
        });
        if (!response.ok) {
            return undefined;
        }

        const body = await response.json();

        if (!responseObjectValid(body)) {
            return undefined;
        }

        return body.token as string;
    };

    const isTimestampExpired = (exp: number): boolean => {
        const currentTimestamp = Date.now();
        // If expired timestamp > current timestamp => token is still valid
        // Offset a little to ensure token validity when actually sending the request
        const result = exp * 1000 - currentTimestamp;
        return result <= 5000;
    };

    /**
     *
     * @param url
     * @param method
     * @param body
     * @description This return the response body when it's parsable, or true. Will return false when it's a failed request
     *
     * @returns Promise<any> [object | true | false]
     */
    const sendBaseRequest = async (
        url: string,
        method: HttpMethod,
        body?: any
    ): Promise<Response> => {
        if (
            config == null ||
            config.authorizationRequired == null ||
            config.timeout == null ||
            config.needJsonBody == null
        ) {
            return await Promise.reject(new Error("Config missing"));
        }

        const headers = await getHeaders();

        // Use signal to avoid running the request for too long
        // Docs for canceling fetch API request
        // https://javascript.info/fetch-abort
        const timeout = config.timeout;
        const controller = new AbortController();
        if (isNaN(timeout) || timeout <= 0) {
            throw new Error(
                "Timeout value is not valid. Please reconfig in .env"
            );
        }

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        const options = {
            method,
            headers,
            body: undefined,
            signal: controller.signal,
        };

        if (body != null) {
            options.body = config.needJsonBody ? JSON.stringify(body) : body;
        }

        if (options.headers.get("Content-Type") === "multipart/form-data") {
            delete headers["Content-Type"];
        }

        const response = await fetch(`${API_URL}${url}`, options);
        clearTimeout(timeoutId);
        return response;
    };

    return await sendBaseRequest(url, method, body);
};

export const useFetch = (config?: RequestConfig): UseFetchReturn => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleServerError = (error: Error): boolean => {
        // Return to sign in page if unauthorized
        if (error instanceof UnauthorizedError) {
            console.log(error);
            navigation.navigate("SignIn");
            return true;
        }

        return false;
    };

    const sendRequest = async (
        urL: string,
        method: HttpMethod,
        body?: any
    ): Promise<any> => {
        try {
            const response = await sendBaseRequest(urL, method, config, body);
            if (response.status === 401) {
                throw new UnauthorizedError();
            }

            try {
                const result = await response.json();
                return result;
            } catch (e) {
                return false;
            }
        } catch (e) {
            const resolved = handleServerError(e);
            if (!resolved) {
                throw e;
            }
        }
    };

    const getReq = async (url: string): Promise<any> => {
        return await sendRequest(url, HttpMethod.GET);
    };

    const postReq = async (url: string, body: any): Promise<any> => {
        return await sendRequest(url, HttpMethod.POST, body);
    };

    const putReq = async (url: string, body: any): Promise<any> => {
        return await sendRequest(url, HttpMethod.PUT, body);
    };

    const deleteReq = async (url: string): Promise<any> => {
        return await sendRequest(url, HttpMethod.DELETE);
    };

    return { getReq, postReq, putReq, deleteReq };
};

export const useFetchSwr = (
    url: Key,
    config?: RequestConfig
): Pick<SWRResponse, "data" | "error" | "isLoading"> => {
    const { getReq } = useFetch(config);

    const getReqWrap = async ([url, queryParams = ""]: [
        url: string,
        queryParams: string
    ]): Promise<any> => {
        console.log("URL", url);
        console.log("params", queryParams);

        const urlWithParam = `${url}${queryParams}`;
        return await getReq(urlWithParam);
    };

    const { data, isLoading, error } = useSwr(url, getReqWrap);

    return { data, isLoading, error };
};

import { API_URL, API_TIMEOUT, KEYCHAIN_ID } from "@env";
import { useNavigation } from "@react-navigation/core";
import UnauthorizedError from "./errors/Unauthorized";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getKeychainValue } from "@/common/keychainService";
import { type RootStackParamList } from "@/types/navigation";

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

export const useFetch = (config?: RequestConfig): UseFetchReturn => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Substitute missing config
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
            // Get access token from secure storage
            const accessToken = await getKeychainValue(KEYCHAIN_ID);
            if (accessToken == null) {
                throw new Error("Access token not found");
            }
            headers.append("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
    };

    const handleServerError = (error: Error): boolean => {
        // Return to sign in page if unauthorized
        if (error instanceof UnauthorizedError) {
            navigation.navigate("SignIn");
            return true;
        }

        return false;
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
    ): Promise<any> => {
        if (
            config == null ||
            config.authorizationRequired == null ||
            config.timeout == null ||
            config.needJsonBody == null
        ) {
            return;
        }

        try {
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
                body: config.needJsonBody ? JSON.stringify(body) : body,
                signal: controller.signal,
            };

            if (options.headers.get("Content-Type") === "multipart/form-data") {
                delete headers["Content-Type"];
            }

            const response = await fetch(`${API_URL}${url}`, options);

            if (response.status === 401) {
                throw new UnauthorizedError();
            }

            clearTimeout(timeoutId);

            // Avoid empty response body from server
            try {
                const body = await response.json();
                return body;
            } catch {
                return true;
            }
        } catch (err) {
            if (handleServerError(err)) {
                return false;
            }

            throw err;
        }
    };

    const getReq = async (url: string): Promise<any> => {
        return await sendBaseRequest(url, HttpMethod.GET);
    };

    const postReq = async (url: string, body: any): Promise<any> => {
        return await sendBaseRequest(url, HttpMethod.POST, body);
    };

    const putReq = async (url: string, body: any): Promise<any> => {
        return await sendBaseRequest(url, HttpMethod.PUT, body);
    };

    const deleteReq = async (url: string): Promise<any> => {
        return await sendBaseRequest(url, HttpMethod.DELETE);
    };

    return { getReq, postReq, putReq, deleteReq };
};

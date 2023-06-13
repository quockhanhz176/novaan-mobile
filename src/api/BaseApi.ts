import { getKeychainValue } from "../keychain/KeychainService";
import { type Undefinable } from "../types/common";
import { API_URL, API_TIMEOUT, KEYCHAIN_ID } from "@env";

interface RequestConfig {
    timeout: number;
    authorizationRequired: boolean;
}

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

class BaseApi {
    private readonly apiURL: string;
    private readonly keychainId: string;

    constructor() {
        if (API_URL == null) {
            throw new Error("API_URL is not defined inside .env");
        }
        if (KEYCHAIN_ID == null) {
            throw new Error("KEYCHAIN_ID is not defined inside .env");
        }

        this.apiURL = API_URL;
    }

    getDefaultConfig(): RequestConfig {
        if (API_TIMEOUT == null) {
            throw new Error("API_TIMEOUT is not defined inside .env");
        }
        const requestTimeout = Number(API_TIMEOUT);
        return {
            timeout: requestTimeout,
            authorizationRequired: false,
        };
    }

    async getHeaders(accessTokenRequired: boolean = false): Promise<Headers> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Access-Control-Allow-Origin", "*");

        if (accessTokenRequired) {
            // Get access token from secure storage
            const accessToken = await getKeychainValue(this.keychainId);
            if (accessToken == null) {
                throw new Error("Access token not found");
            }
            headers.append("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
    }

    async get<ResponseType>(
        url: string = "",
        requestConfig?: RequestConfig
    ): Promise<ResponseType> {
        return await this.sendRequestBase(url, HttpMethod.GET, requestConfig);
    }

    async post<RequestType, ResponseType>(
        url: string,
        body: RequestType,
        requestConfig?: RequestConfig
    ): Promise<ResponseType> {
        return await this.sendRequestBase(
            url,
            HttpMethod.POST,
            requestConfig,
            body
        );
    }

    async put<RequestType, ResponseType>(
        url: string,
        body: RequestType,
        requestConfig?: RequestConfig
    ): Promise<ResponseType> {
        return await this.sendRequestBase(
            url,
            HttpMethod.PUT,
            requestConfig,
            body
        );
    }

    async delete<ResponseType>(
        url: string,
        requestConfig?: RequestConfig
    ): Promise<ResponseType> {
        return await this.sendRequestBase(
            url,
            HttpMethod.DELETE,
            requestConfig
        );
    }

    async sendRequestBase(
        url: string,
        method: string,
        requestConfig: Undefinable<RequestConfig> = this.getDefaultConfig(),
        body?: any
    ): Promise<any> {
        const headers = await this.getHeaders(
            requestConfig.authorizationRequired
        );

        // Use signal to avoid running the request for too long
        // Docs for canceling fetch API request
        // https://javascript.info/fetch-abort
        const timeout = requestConfig.timeout;
        const controller = new AbortController();
        if (isNaN(timeout) || timeout <= 0) {
            throw new Error(
                "Timeout value is not valid. Please reconfig in .env"
            );
        }

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        const response = await fetch(`${this.apiURL}${url}`, {
            method,
            headers,
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return await response.json();
    }
}

export default BaseApi;
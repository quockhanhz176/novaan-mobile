import { type FailableResponse } from "./common/types/FailableResponse";
import { type NonConcrete } from "@/common/utils";
import { sendBaseRequest } from "./baseApiHook";

interface RequestConfig {
    timeout: number;
    authorizationRequired: boolean;
    contentType?: string;
    needJsonBody?: boolean;
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

class BaseApi {
    async get(
        url: string = "",
        requestConfig?: RequestConfig
    ): Promise<Response> {
        return await sendBaseRequest(url, HttpMethod.GET, requestConfig);
    }

    async post<RequestType>(
        url: string,
        body?: RequestType,
        requestConfig?: RequestConfig
    ): Promise<Response> {
        return await sendBaseRequest(url, HttpMethod.POST, requestConfig, body);
    }

    async put<RequestType>(
        url: string,
        body: RequestType,
        requestConfig?: RequestConfig
    ): Promise<Response> {
        return await sendBaseRequest(url, HttpMethod.PUT, requestConfig, body);
    }

    async delete(
        url: string,
        requestConfig?: RequestConfig
    ): Promise<Response> {
        return await sendBaseRequest(url, HttpMethod.DELETE, requestConfig);
    }

    // async sendRequestBase(
    //     url: string,
    //     method: string,
    //     requestConfig: Undefinable<RequestConfig> = this.getDefaultConfig(),
    //     body?: any
    // ): Promise<Response> {
    //     const headers = await this.getHeaders(
    //         requestConfig.authorizationRequired,
    //         requestConfig.contentType
    //     );

    //     // Use signal to avoid running the request for too long
    //     // Docs for canceling fetch API request
    //     // https://javascript.info/fetch-abort
    //     const timeout = requestConfig.timeout;
    //     const controller = new AbortController();
    //     if (isNaN(timeout) || timeout <= 0) {
    //         throw new Error(
    //             "Timeout value is not valid. Please reconfig in .env"
    //         );
    //     }

    //     const timeoutId = setTimeout(() => {
    //         controller.abort();
    //     }, timeout);

    //     if (
    //         requestConfig === null ||
    //         requestConfig.needJsonBody === undefined
    //     ) {
    //         requestConfig.needJsonBody = true;
    //     }

    //     const response = await fetch(`${this.apiURL}${url}`, {
    //         method,
    //         headers,
    //         body: requestConfig.needJsonBody ? JSON.stringify(body) : body,
    //         signal: controller.signal,
    //     });

    //     clearTimeout(timeoutId);

    //     return response;
    // }

    async sendReceiveBase<T>(
        url: string,
        caller: string,
        method: HttpMethod,
        body?: any,
        config?: NonConcrete<RequestConfig>
    ): Promise<FailableResponse<T>> {
        try {
            const response = await sendBaseRequest(
                url,
                method,
                {
                    timeout: 3000,
                    authorizationRequired: true,
                    ...config,
                },
                method === HttpMethod.GET ? undefined : body
            );
            console.log(`${caller} - response: ${JSON.stringify(response)}`);
            let responseBody: any;
            try {
                responseBody = await response.json();
                console.log(
                    `${caller} - body: ${JSON.stringify(responseBody)}`
                );
            } catch {}

            if (!response.ok) {
                const code: number = responseBody?.code ?? -1;
                return {
                    success: false,
                    code,
                };
            }

            return {
                success: true,
                value: responseBody,
            };
        } catch (e) {
            console.error(`${caller} - error:`, e);
            return {
                success: false,
                code: -1,
            };
        }
    }
}

export default BaseApi;

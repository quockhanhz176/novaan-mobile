import { getKeychainValue } from "@/common/keychainService";
import { KEYCHAIN_ID } from "@env";
import { decode as decodeBase64 } from "base-64";

export const parseJwt = (token: string): any => {
    const base64Url = token.split(".")[1];
    const jsonPayload = decodeBase64(base64Url);
    return JSON.parse(jsonPayload);
};

export const getUserIdFromToken = async (): Promise<string> => {
    const token = await getKeychainValue(KEYCHAIN_ID);
    const payload = parseJwt(token);
    if (payload == null || typeof payload === "string") {
        throw new Error();
    }

    return payload.nameid;
};

/**
 * Extract payload from a JWT without verifying
 * @param token (optional) - A JWT
 * @returns Payload object with generic type T
 *
 * Will use token from storage if none passed into this function
 */
export const getPayloadFromToken = async <T>(token?: string): Promise<T> => {
    if (token == null) {
        token = await getKeychainValue(KEYCHAIN_ID);
    }
    const payload = parseJwt(token);
    if (payload == null || typeof payload === "string") {
        throw new Error();
    }

    return payload;
};

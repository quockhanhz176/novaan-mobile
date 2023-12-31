import { useState } from "react";
import { useFetch } from "../baseApiHook";
import {
    type UseResourceUrlDirectReturn,
    type UseFetchResourceUrlReturn,
} from "./utils.type";
import { responseObjectValid } from "../common/utils/ResponseUtils";
import { type Undefinable } from "@/types/app";

const GET_RESOURCE_URL = "content/download";

export const useFetchResourceUrl = (): UseFetchResourceUrlReturn => {
    const { getReq } = useFetch({
        authorizationRequired: true,
        timeout: 10000,
    });

    const [resourceUrl, setResourceUrl] = useState<string>("");

    const fetchUrl = async (id: string): Promise<boolean> => {
        const response = await getReq(`${GET_RESOURCE_URL}/${id}`);
        if (!responseObjectValid(response)) {
            return false;
        }

        if (!("url" in response)) {
            return false;
        }

        setResourceUrl(response.url);
        return true;
    };

    return { resourceUrl, fetchUrl };
};

export const useResourceUrl = (): UseResourceUrlDirectReturn => {
    const { getReq } = useFetch({
        authorizationRequired: true,
        timeout: 10000,
    });

    // Directly return the URL for the request resources
    const fetchUrl = async (id: string): Promise<Undefinable<string>> => {
        const response = await getReq(`${GET_RESOURCE_URL}/${id}`);
        if (!responseObjectValid(response)) {
            return undefined;
        }

        if (!("url" in response)) {
            return undefined;
        }

        return response.url;
    };

    return { fetchUrl };
};

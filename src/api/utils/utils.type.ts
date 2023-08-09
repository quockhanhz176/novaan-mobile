import { type Undefinable } from "@/types/app";

export interface UseFetchResourceUrlReturn {
    resourceUrl: string;
    fetchUrl: (id: string) => Promise<boolean>;
}

export interface UseResourceUrlDirectReturn {
    fetchUrl: (id: string) => Promise<Undefinable<string>>;
}

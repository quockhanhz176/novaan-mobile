import { type Undefinable } from "@/types/app";

export interface UseRefreshTokenReturn {
    refreshToken: () => Promise<Undefinable<string>>;
}

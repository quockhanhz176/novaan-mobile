export interface PaginationHookReturn<T> {
    content: T[];
    ended: boolean;
    getNext: () => Promise<void>;
    refresh: () => void;
}

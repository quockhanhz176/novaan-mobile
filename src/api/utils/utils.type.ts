export interface UseFetchResourceUrlReturn {
    resourceUrl: string;
    fetchUrl: (id: string) => Promise<boolean>;
}

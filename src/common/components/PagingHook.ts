import { type MutableRefObject, useCallback, useRef, useState } from "react";

type PagingHookReturn<T, U> = [
    list: T[] | undefined,
    fetch: (params: U) => Promise<void>,
    fetchNext: () => Promise<void>,
    reset: () => void,
    duringFirstFetch: boolean,
    offset: { current: number },
    paramRef: MutableRefObject<U | undefined>
];

const usePagingHook = <T, U>(
    fetchData: (
        start: number,
        size: number,
        params?: U
    ) => Promise<T[] | undefined | null>,
    size: number = 10,
    start: number = 0
): PagingHookReturn<T, U> => {
    const [list, setList] = useState<T[]>();
    const [duringFirstFetch, setDuringFirstFetch] = useState(false);
    const offset = useRef(start);
    const ended = useRef(false);
    const paramsRef = useRef<U>();

    const fetchNext = useCallback(
        async (params: U, reset: boolean = false) => {
            if (!reset && ended.current) {
                return;
            }

            let currentList = list ?? [];
            if (reset) {
                offset.current = 0;
                ended.current = false;
                paramsRef.current = params;
                currentList = [];
                setDuringFirstFetch(true);
            }


            const result = await fetchData(
                offset.current,
                size,
                paramsRef.current
            );

            if (reset) {
                setDuringFirstFetch(false);
            }

            if (result == null || result.length === 0) {
                ended.current = true;
                setList(currentList);
                return;
            }

            offset.current += result.length;
            console.log(
                "post offset:",
                offset.current,
                "length:",
                result.length
            );
            setList([...currentList, ...result]);
        },
        [fetchData, list, size, start]
    );

    const fetchNextNoReset = useCallback(async () => {
        if (paramsRef.current == null) {
            return;
        }
        await fetchNext(paramsRef.current, false);
    }, [fetchNext]);

    const fetchNextReset = useCallback(
        async (params: U) => {
            await fetchNext(params, true);
        },
        [fetchNext]
    );

    const reset = useCallback(() => {
        setList(undefined);
    }, []);

    return [
        list,
        fetchNextReset,
        fetchNextNoReset,
        reset,
        duringFirstFetch,
        offset,
        paramsRef,
    ];
};

export default usePagingHook;

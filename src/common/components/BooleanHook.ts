import { useCallback, useState } from "react";

type BooleanHookReturn = [
    boolean,
    () => void,
    () => void,
    (value: boolean) => void
];

const useBooleanHook = (
    onValueChange?: (modalVisible: boolean) => void,
    initialValue?: boolean
): BooleanHookReturn => {
    const [value, setInternalValue] = useState(initialValue ?? false);

    const setValue = useCallback(
        (value: boolean): void => {
            setInternalValue(value);
            onValueChange?.(value);
        },
        [onValueChange]
    );

    const setFalse = useCallback((): void => {
        setValue(false);
    }, [setValue]);

    const setTrue = useCallback((): void => {
        setValue(true);
    }, [setValue]);

    return [value, setFalse, setTrue, setValue];
};

export default useBooleanHook;

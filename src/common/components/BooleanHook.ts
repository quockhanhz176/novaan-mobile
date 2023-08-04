import { useState } from "react";

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

    const setValue = (value: boolean): void => {
        setInternalValue(value);
        onValueChange?.(value);
    };

    const setFalse = (): void => {
        setValue(false);
    };

    const setTrue = (): void => {
        setValue(true);
    };

    return [value, setFalse, setTrue, setValue];
};

export default useBooleanHook;

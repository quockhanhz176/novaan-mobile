import { useState } from "react";

type ScrollModalHookReturn = [
    boolean,
    () => void,
    () => void,
    (value: boolean) => void
];

const useModalHook = (
    onModalShownChange?: (modalVisible: boolean) => void
): ScrollModalHookReturn => {
    const [modalVisible, setModalVisible] = useState(false);

    const setModalShown = (value: boolean): void => {
        setModalVisible(value);
        onModalShownChange?.(value);
    };

    const setModalShownFalse = (): void => {
        setModalShown(false);
    };

    const setModalShownTrue = (): void => {
        setModalShown(true);
    };

    return [modalVisible, setModalShownFalse, setModalShownTrue, setModalShown];
};

export default useModalHook;

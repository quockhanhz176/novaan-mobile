import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import React, { type ReactElement, memo, useMemo, useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";

interface PreferenceChipProps {
    item: PreferenceResponse;
    selected: boolean;
    onPress: (category: PreferenceResponse) => void;
}

const PreferenceChip = ({
    item,
    onPress,
    selected,
}: PreferenceChipProps): ReactElement<PreferenceChipProps> => {
    const buttonExtraStyle = useMemo(
        () => (selected ? "bg-cprimary-300 border-cprimary-300" : ""),
        [selected]
    );

    const textExtraStyle = useMemo(
        () => (selected ? "text-white" : ""),
        [selected]
    );

    const handleOnPress = useCallback((): void => {
        requestAnimationFrame(() => {
            onPress(item);
        });
    }, [onPress, item]);

    return (
        <TouchableOpacity
            delayPressIn={0}
            onPress={handleOnPress}
            activeOpacity={0.6}
            className={`px-4 py-2 items-center justify-center rounded-full border my-2 mx-1 ${buttonExtraStyle}`}
        >
            <Text className={textExtraStyle}>{item.title}</Text>
        </TouchableOpacity>
    );
};

export default memo(
    PreferenceChip,
    (prev, next) =>
        prev.item.id === next.item.id && prev.selected === next.selected
);

import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import React, { type ReactElement, memo, useMemo } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Tooltip } from "react-native-paper";

interface PreferenceChipProps {
    item: PreferenceResponse;
    selectedCategories: string[];
    onPress: () => void;
}

const PreferenceChip = ({
    item,
    onPress,
    selectedCategories,
}: PreferenceChipProps): ReactElement<PreferenceChipProps> => {
    const { title, description } = item;

    const selected = useMemo(
        () =>
            selectedCategories.find((categoryId) => categoryId === item.id) !=
            null,
        [selectedCategories]
    );

    const buttonExtraStyle = useMemo(
        () => (selected ? "bg-cprimary-300 border-cprimary-300" : ""),
        [selected]
    );

    const textExtraStyle = useMemo(
        () => (selected ? "text-white" : ""),
        [selected]
    );

    return (
        <Tooltip title={description} enterTouchDelay={1000}>
            <TouchableOpacity
                onPress={onPress}
                delayPressIn={0}
                activeOpacity={0.8}
                className={`px-4 py-2 items-center justify-center rounded-full border m-1 ${buttonExtraStyle}`}
            >
                <Text className={textExtraStyle}>{title}</Text>
            </TouchableOpacity>
        </Tooltip>
    );
};

export default memo(PreferenceChip);

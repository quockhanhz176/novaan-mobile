import { memo, type FC } from "react";
import React, { View, Text } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import type Preference from "../types/Preference";
import { customColors } from "@root/tailwind.config";

interface FilterItemProps {
    preference: Preference;
    onPreferenceChange: (preference: Preference) => void;
}

export const FILTER_ITEM_HEIGHT = 50;

const FilterItem: FC<FilterItemProps> = ({
    preference,
    onPreferenceChange,
}) => {
    const onValueChange = (value: boolean): void => {
        const newPreference = { ...preference, checked: value };
        onPreferenceChange(newPreference);
    };

    return (
        <View
            className="py-3 w-full flex-row justify-between items-center"
            style={{
                height: FILTER_ITEM_HEIGHT,
            }}
        >
            <Text className="text-base">{preference.title}</Text>
            <CheckBox
                tintColors={{
                    true: customColors.csecondary,
                    false: customColors.cgrey.battleship,
                }}
                value={preference.checked}
                onValueChange={onValueChange}
            />
        </View>
    );
};

export default memo(FilterItem);

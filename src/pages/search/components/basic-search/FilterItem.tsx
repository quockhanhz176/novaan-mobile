import { memo, type FC } from "react";
import React, { View, Text } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { customColors } from "@root/tailwind.config";
import { type SuiteDispatchValue } from "./filterReducer";
import type Preference from "../../types/Preference";

export type FilterItemDispatchValue = Omit<
    Extract<SuiteDispatchValue, { type: "change_preference" }>,
    "type" | "category"
>;

interface FilterItemProps {
    preference: Preference;
    index: number;
    dispatchPreference: (value: FilterItemDispatchValue) => void;
}

export const FILTER_ITEM_HEIGHT = 50;

const FilterItem: FC<FilterItemProps> = ({
    preference,
    index,
    dispatchPreference,
}) => {
    const onValueChange = (value: boolean): void => {
        dispatchPreference({ preferenceIndex: index, value });
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

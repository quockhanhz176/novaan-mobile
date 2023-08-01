import {
    memo,
    type FC,
    type ReactElement,
    useRef,
    useState,
    useCallback,
} from "react";
import React, { View, Text, Animated } from "react-native";
import FilterItem, {
    FILTER_ITEM_HEIGHT,
    type FilterItemDispatchValue,
} from "./FilterItem";
import type PreferenceCategory from "../../types/PreferenceCategory";
import IconLabelButton from "@/common/components/IconLabelButton";
import { type SuiteDispatchValue } from "./filterReducer";
import { getPreferenceProperty } from "../../types/PreferenceSuite";
import Preference from "../../types/Preference";

interface FilterCategoryProps {
    category: PreferenceCategory;
    dispatchSuite: (value: SuiteDispatchValue) => void;
}

const ITEM_LIST_PADDING_TOP = 16;

const FilterCategory: FC<FilterCategoryProps> = ({
    category,
    dispatchSuite,
}) => {
    const dropDownAnimation = useRef(new Animated.Value(0)).current;
    const [expanded, setExpanded] = useState(false);

    const itemListHeight =
        FILTER_ITEM_HEIGHT * category.preferences.length +
        ITEM_LIST_PADDING_TOP;

    const onExpandPress = (): void => {
        Animated.timing(dropDownAnimation, {
            toValue: expanded ? 0 : itemListHeight,
            duration: 500,
            useNativeDriver: false,
        }).start();
        setExpanded(!expanded);
    };

    const dispatchPreference = useCallback(
        (value: FilterItemDispatchValue): void => {
            const currentCategory = getPreferenceProperty(category.index);

            dispatchSuite({
                type: "change_preference",
                category: currentCategory,
                ...value,
            });
        },
        [category.index]
    );

    const renderItem = useCallback(
        (preference: Preference, index: number): ReactElement => {
            return (
                <FilterItem
                    key={index}
                    preference={preference}
                    dispatchPreference={dispatchPreference}
                />
            );
        },
        [dispatchPreference]
    );

    return (
        <View className="overflow-hidden mb-7">
            <View className="flex-row justify-between items-center">
                <Text className="text-base font-bold uppercase tracking-wide">
                    {category.label}
                </Text>
                <IconLabelButton
                    buttonClassName="space-x-0 mr-2"
                    iconPack="Feather"
                    iconProps={{
                        name: expanded ? "chevron-up" : "chevron-down",
                        size: 20,
                    }}
                    buttonProps={{ onPress: onExpandPress }}
                />
            </View>
            <Animated.View
                style={{
                    height: dropDownAnimation,
                }}
            >
                <View style={{ paddingTop: ITEM_LIST_PADDING_TOP }}>
                    {category.preferences.map(renderItem)}
                </View>
            </Animated.View>
        </View>
    );
};

export default memo(FilterCategory);

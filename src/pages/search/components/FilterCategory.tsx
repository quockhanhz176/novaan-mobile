import {
    memo,
    type FC,
    type ReactElement,
    useCallback,
    useRef,
    useState,
} from "react";
import React, { View, Text, Animated } from "react-native";
import type Preference from "../types/Preference";
import FilterItem, { FILTER_ITEM_HEIGHT } from "./FilterItem";
import type PreferenceCategory from "../types/PreferenceCategory";
import IconLabelButton from "@/common/components/IconLabelButton";

interface FilterCategoryProps {
    category: PreferenceCategory;
    onCategoryChange: (value: PreferenceCategory) => void;
}

const ITEM_LIST_PADDING_TOP = 16;

const FilterCategory: FC<FilterCategoryProps> = ({
    category,
    onCategoryChange,
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

    const onPreferenceChange = useCallback((preference: Preference): void => {
        const items = [
            ...category.preferences.slice(0, preference.index),
            preference,
            ...category.preferences.slice(preference.index + 1),
        ];
        category = { ...category, preferences: items };
        onCategoryChange(category);
    }, []);

    const renderItem = (
        preference: Preference,
        index: number
    ): ReactElement => {
        return (
            <FilterItem
                key={index}
                preference={preference}
                onPreferenceChange={onPreferenceChange}
            />
        );
    };

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

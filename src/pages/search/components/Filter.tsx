import { useCallback, type FC, type ReactElement } from "react";
import React, { ScrollView, TouchableOpacity, View, Text } from "react-native";
import type PreferenceSuite from "../types/PreferenceSuite";
import FilterCategory from "./FilterCategory";
import type PreferenceCategory from "../types/PreferenceCategory";
import IconAnt from "react-native-vector-icons/AntDesign";
import { FILTER_TITLE } from "@/common/strings";

interface FilterProps {
    suite: PreferenceSuite;
    onSuiteChange: (value: PreferenceSuite) => void;
    hideModal: () => void;
}

const Filter: FC<FilterProps> = ({ suite, onSuiteChange, hideModal }) => {
    const onCategoryChange = useCallback(
        (category: PreferenceCategory): void => {
            suite[Object.keys(suite)[category.index]] = category;
            onSuiteChange({ ...suite });
        },
        []
    );

    const renderItem = (
        category: PreferenceCategory,
        index: number
    ): ReactElement => {
        return (
            <FilterCategory
                key={index}
                category={category}
                onCategoryChange={onCategoryChange}
            />
        );
    };

    return (
        <View className="flex-1">
            <View
                className="h-[58] flex-row justify-between px-1 border-cgrey-platinum"
                style={{ borderBottomWidth: 1 }}
            >
                <View className="flex-row space-x-2 items-center">
                    <TouchableOpacity
                        onPress={hideModal}
                        className="h-10 w-10 items-center justify-center"
                    >
                        <IconAnt name="arrowleft" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-medium">{FILTER_TITLE}</Text>
                </View>
            </View>
            <View className="flex-1 pt-7">
                <ScrollView className="px-3 pb-10">
                    {Object.values(suite).map(renderItem)}
                </ScrollView>
            </View>
        </View>
    );
};

export default Filter;

import { memo, type FC, type ReactElement, useCallback } from "react";
import React, { ScrollView, TouchableOpacity, View, Text } from "react-native";
import type PreferenceSuite from "../../types/PreferenceSuite";
import FilterCategory from "./FilterCategory";
import IconAnt from "react-native-vector-icons/AntDesign";
import { FILTER_TITLE } from "@/common/strings";
import { type SuiteDispatchValue } from "./filterReducer";

interface FilterProps {
    suite: PreferenceSuite;
    dispatchSuite: (value: SuiteDispatchValue) => void;
    hideModal: () => void;
}

const Filter: FC<FilterProps> = ({ suite, dispatchSuite, hideModal }) => {
    const renderItem = useCallback(
        (key: keyof PreferenceSuite, index: number): ReactElement => {
            return (
                <FilterCategory
                    key={index}
                    category={suite[key]}
                    propertyKey={key}
                    dispatchSuite={dispatchSuite}
                />
            );
        },
        [suite, dispatchSuite]
    );

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
                    {Object.keys(suite).map(renderItem)}
                </ScrollView>
            </View>
        </View>
    );
};

export default memo(Filter);

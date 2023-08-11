import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import React, { memo, useCallback, type ReactElement } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import PreferenceChip from "./PreferenceChip";
import { customColors } from "@root/tailwind.config";
import { type PreferenceObj } from "@/pages/create-post/create-recipe/types/PreferenceObj";

interface PreferenceSectionProps {
    categories: PreferenceResponse[];
    selectedCategories: PreferenceObj;
    setCategories: (category: PreferenceResponse) => void;
    sectionDesc?: string;
}

const PreferenceSection = ({
    categories,
    selectedCategories,
    sectionDesc,
    setCategories,
}: PreferenceSectionProps): ReactElement<PreferenceSectionProps> => {
    const isSelected = useCallback(
        (category: PreferenceResponse): boolean => {
            return selectedCategories[category.id] == null
                ? false
                : (selectedCategories[category.id] as boolean);
        },
        [selectedCategories]
    );

    if (categories.length === 0) {
        return <View></View>;
    }

    return (
        <View className="flex-1">
            {(sectionDesc != null || sectionDesc !== "") && (
                <Text className="text-base p-5 bg-ctertiary">
                    {sectionDesc}
                </Text>
            )}
            {categories.length > 0 ? (
                <View className="flex-row flex-wrap pt-2 px-2">
                    {categories.map((category) => (
                        <PreferenceChip
                            key={category.id}
                            item={category}
                            onPress={setCategories}
                            selected={isSelected(category)}
                        />
                    ))}
                </View>
            ) : (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator
                        animating={true}
                        color={customColors.cprimary[300]}
                        size={100}
                    />
                </View>
            )}
        </View>
    );
};

export default memo(
    PreferenceSection,
    (prev, next) =>
        prev.categories === next.categories &&
        prev.selectedCategories === next.selectedCategories
);

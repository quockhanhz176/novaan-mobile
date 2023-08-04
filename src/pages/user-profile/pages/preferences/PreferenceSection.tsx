import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import React, { type ReactElement } from "react";
import { View, Text } from "react-native";
import PreferenceChip from "./PreferenceChip";
import OverlayLoading from "@/common/components/OverlayLoading";

interface PreferenceSectionProps {
    categories: PreferenceResponse[];
    selectedCategories: PreferenceResponse[];
    setCategories: (category: PreferenceResponse) => void;
    sectionDesc: string;
}

const PreferenceSection = ({
    categories,
    selectedCategories,
    sectionDesc,
    setCategories,
}: PreferenceSectionProps): ReactElement<PreferenceSectionProps> => {
    return (
        <View className="flex-1">
            <Text className="text-base p-5 bg-ctertiary">{sectionDesc}</Text>
            <View className="flex-row flex-wrap pt-4">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <PreferenceChip
                            key={category.id}
                            item={category}
                            onPress={() => {
                                setCategories(category);
                            }}
                            selectedCategories={selectedCategories}
                        />
                    ))
                ) : (
                    <OverlayLoading />
                )}
            </View>
        </View>
    );
};

export default PreferenceSection;

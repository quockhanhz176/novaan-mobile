import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import React, { type ReactElement } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import PreferenceChip from "./PreferenceChip";
import OverlayLoading from "@/common/components/OverlayLoading";
import { customColors } from "@root/tailwind.config";

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
            {categories.length > 0 ? (
                <View className="flex-row flex-wrap pt-4">
                    {categories.map((category) => (
                        <PreferenceChip
                            key={category.id}
                            item={category}
                            onPress={() => {
                                setCategories(category);
                            }}
                            selectedCategories={selectedCategories}
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

export default PreferenceSection;

import { useAppPreferences } from "@/api/profile/ProfileApi";
import PreferenceSection from "@/pages/user-profile/pages/preferences/PreferenceSection";
import React, {
    useEffect,
    type ReactElement,
    useContext,
    memo,
    useCallback,
} from "react";
import { ScrollView } from "react-native-gesture-handler";
import { recipeInformationContext } from "../types/RecipeParams";
import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import {
    CREATE_RECIPE_CATEGORY_SUBTITLE,
    CREATE_RECIPE_DIET_SUBTITLE,
    CREATE_RECIPE_MEAL_TYPES_SUBTITLE,
} from "@/common/strings";
import { Text, View } from "react-native";
import { type PreferenceObj } from "../types/PreferenceObj";

const DietMealType = (): ReactElement => {
    const {
        isEditing,
        diets: selectedDiets,
        setDiets: setSelectedDiets,
        mealTypes: selectedMealTypes,
        setMealTypes: setSelectedMealTypes,
    } = useContext(recipeInformationContext);
    const { diets, mealTypes, getAllPreferenceOptions } = useAppPreferences();

    useEffect(() => {
        void getAllPreferenceOptions();
    }, []);

    // Modify to use with setState
    const handleSelectDiet = useCallback((category: PreferenceResponse) => {
        setSelectedDiets(((selected: PreferenceObj) => ({
            ...selected,
            [category.id]: !(selected[category.id] ?? false),
        })) as unknown as PreferenceObj);
    }, []);

    const handleSelectMealType = useCallback((category: PreferenceResponse) => {
        setSelectedMealTypes(((selected: PreferenceObj) => ({
            ...selected,
            [category.id]: !(selected[category.id] ?? false),
        })) as unknown as PreferenceObj);
    }, []);

    return (
        <ScrollView className="flex-1 bg-white">
            {!isEditing && (
                <Text className="text-base p-5 bg-ctertiary">
                    {CREATE_RECIPE_CATEGORY_SUBTITLE}
                </Text>
            )}
            <View className={isEditing ? "" : "mt-4"}>
                <PreferenceSection
                    categories={diets}
                    sectionDesc={CREATE_RECIPE_DIET_SUBTITLE}
                    selectedCategories={selectedDiets}
                    setCategories={handleSelectDiet}
                />
            </View>
            <View className="mt-4">
                <PreferenceSection
                    categories={mealTypes}
                    sectionDesc={CREATE_RECIPE_MEAL_TYPES_SUBTITLE}
                    selectedCategories={selectedMealTypes}
                    setCategories={handleSelectMealType}
                />
            </View>
        </ScrollView>
    );
};

export default memo(DietMealType);

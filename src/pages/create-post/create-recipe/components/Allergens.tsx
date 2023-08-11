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
import { CREATE_RECIPE_ALLERGEN_SUBTITLE } from "@/common/strings";
import { type PreferenceObj } from "../types/PreferenceObj";

const Allergens = (): ReactElement => {
    const { allergens: selectedAllergens, setAllergens: setSelectedAllergens } =
        useContext(recipeInformationContext);
    const { allergens, getAllPreferenceOptions } = useAppPreferences();

    useEffect(() => {
        void getAllPreferenceOptions();
    }, []);

    const handleSelectAllergen = useCallback((category: PreferenceResponse) => {
        setSelectedAllergens(((selected: PreferenceObj) => ({
            ...selected,
            [category.id]: !(selected[category.id] ?? false),
        })) as unknown as PreferenceObj);
    }, []);

    return (
        <ScrollView className="flex-1 bg-white">
            <PreferenceSection
                categories={allergens}
                sectionDesc={CREATE_RECIPE_ALLERGEN_SUBTITLE}
                selectedCategories={selectedAllergens}
                setCategories={handleSelectAllergen}
            />
        </ScrollView>
    );
};

export default memo(Allergens);

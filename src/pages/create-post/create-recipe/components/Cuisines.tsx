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
import { CREATE_RECIPE_CUISINE_SUBTITLE } from "@/common/strings";
import { type PreferenceObj } from "../types/PreferenceObj";

const Cuisines = (): ReactElement => {
    const { cuisines: selectedCuisines, setCuisines: setSelectedCuisines } =
        useContext(recipeInformationContext);
    const { cuisines, getAllPreferenceOptions } = useAppPreferences();

    useEffect(() => {
        void getAllPreferenceOptions();
    }, []);

    const handleSelectCuisine = useCallback((category: PreferenceResponse) => {
        setSelectedCuisines(((selected: PreferenceObj) => ({
            ...selected,
            [category.id]: !(selected[category.id] ?? false),
        })) as unknown as PreferenceObj);
    }, []);

    return (
        <ScrollView className="flex-1 bg-white">
            <PreferenceSection
                categories={cuisines}
                sectionDesc={CREATE_RECIPE_CUISINE_SUBTITLE}
                selectedCategories={selectedCuisines}
                setCategories={handleSelectCuisine}
            />
        </ScrollView>
    );
};

export default memo(Cuisines);

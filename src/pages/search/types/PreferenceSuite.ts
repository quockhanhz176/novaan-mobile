import type PreferenceSuiteResponse from "@/api/search/types/PreferenceSuiteResponse";
import type PreferenceCategory from "./PreferenceCategory";

type PreferenceSuite = {
    [Property in keyof PreferenceSuiteResponse]: PreferenceCategory;
};

export const getPreferenceProperty = (index: number): keyof PreferenceSuite => {
    switch (index) {
        case 0:
            return "diets";
        case 1:
            return "cuisines";
        case 2:
            return "allergens";
        default:
            throw Error("index outside of PreferenceSuite property range");
    }
};

export default PreferenceSuite;

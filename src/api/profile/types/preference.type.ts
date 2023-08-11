import type PreferenceResponse from "@/api/search/types/PreferenceResponse";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AllPreferenceResponse = {
    diets: PreferenceResponse[];
    mealTypes: PreferenceResponse[];
    cuisines: PreferenceResponse[];
    allergens: PreferenceResponse[];
};

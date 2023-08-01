import type PreferenceResponse from "./PreferenceResponse";

// index and interface behave differently with index signature
// https://github.com/microsoft/TypeScript/issues/15300
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PreferenceSuiteResponse = {
    diets: PreferenceResponse[];
    cuisines: PreferenceResponse[];
    allergens: PreferenceResponse[];
}

export default PreferenceSuiteResponse;

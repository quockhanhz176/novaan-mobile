import type PreferenceSuiteResponse from "@/api/search/types/PreferenceSuiteResponse";
import type PreferenceCategory from "./PreferenceCategory";

type PreferenceSuite = {
    [Property in keyof PreferenceSuiteResponse]: PreferenceCategory;
};

export default PreferenceSuite;

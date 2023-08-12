import type Preference from "./Preference";

interface PreferenceCategory {
    label: string;
    preferences: Preference[];
}

export default PreferenceCategory;

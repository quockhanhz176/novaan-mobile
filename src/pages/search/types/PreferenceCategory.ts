import type Preference from "./Preference";

interface PreferenceCategory {
    index: number;
    label: string;
    preferences: Preference[];
}

export default PreferenceCategory;

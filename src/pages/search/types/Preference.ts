import type PreferenceResponse from "@/api/search/types/PreferenceResponse";

type Preference = PreferenceResponse & {
    index: number;
    checked: boolean;
};

export default Preference;

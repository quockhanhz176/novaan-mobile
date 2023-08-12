import type PreferenceResponse from "@/api/search/types/PreferenceResponse";

type Preference = PreferenceResponse & {
    checked: boolean;
};

export default Preference;

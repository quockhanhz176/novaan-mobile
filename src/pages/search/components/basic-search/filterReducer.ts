import type PreferenceSuite from "../../types/PreferenceSuite";

export type SuiteDispatchValue =
    | {
          type: "new_value";
          value: PreferenceSuite | undefined;
      }
    | {
          type: "change_preference";
          category: keyof PreferenceSuite;
          preferenceIndex: number;
          value: boolean;
      };

export const suiteReducer = (
    suite: PreferenceSuite | undefined,
    action: SuiteDispatchValue
): PreferenceSuite | undefined => {
    switch (action.type) {
        case "new_value":
            return action.value;
        case "change_preference":
            if (suite == null) {
                return suite;
            }
            return changePreferenceValue(suite, action);
        default:
            return suite;
    }
};

const changePreferenceValue = (
    suite: PreferenceSuite,
    action: Extract<SuiteDispatchValue, { type: "change_preference" }>
): PreferenceSuite => {
    const index = action.preferenceIndex;
    const category = suite[action.category];
    const preferences = category.preferences;

    suite = { ...suite };
    suite[action.category] = {
        ...category,
        preferences: [
            ...preferences.slice(0, index),
            { ...preferences[index], checked: action.value },
            ...preferences.slice(index + 1),
        ],
    };
    return suite;
};

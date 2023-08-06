import {
    SET_PREF_PREV_BTN_TITLE,
    SET_PREF_NEXT_BTN_TITLE,
    SET_PREF_DIET_GUIDE,
    SET_PREF_DONE_BTN_TITLE,
    SET_PREF_CUISINE_GUIDE,
    SET_PREF_ALLERGEN_GUIDE,
    SET_PREF_FAILED,
    SET_PREF_SUCCESS,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import React, {
    useState,
    type ReactElement,
    useRef,
    useMemo,
    type Dispatch,
    type SetStateAction,
    useEffect,
    useCallback,
} from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Bar } from "react-native-progress";
import PreferenceSection from "./PreferenceSection";
import type PreferenceResponse from "@/api/search/types/PreferenceResponse";
import Swiper from "react-native-swiper";
import { windowWidth } from "@/common/utils";
import {
    useAppPreferences,
    useUserPreferences,
} from "@/api/profile/ProfileApi";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type RootStackParamList } from "@/types/navigation";
import { storeData } from "@/common/AsyncStorageService";

type Preference = PreferenceResponse;

export type PreferenceItem = PreferenceResponse | { selected: boolean };

interface SetPreferencesProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SetPreferences">;
}

const SetPreferences = ({
    navigation,
}: SetPreferencesProps): ReactElement<SetPreferencesProps> => {
    // Query all preferences and save to cache
    const { diets, cuisines, allergens, getAllPreferenceOptions } =
        useAppPreferences();
    const { setUserPreferences } = useUserPreferences();

    useEffect(() => {
        void getAllPreferenceOptions();
    }, []);

    // Store selected preferences
    const [selectedDiets, setSelectedDiets] = useState<Preference[]>([]);
    const [selectedCuisines, setSelectedCuisines] = useState<Preference[]>([]);
    const [selectedAllergens, setSelectedAllergens] = useState<Preference[]>(
        []
    );

    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const progress = useMemo(() => (index + 1) / 3, [index]);

    const swiperRef = useRef<Swiper>(null);

    const handleNextPage = useCallback((): void => {
        // Reached the end
        if (index === 2) {
            return;
        }
        setIndex((index) => index + 1);
        swiperRef.current?.scrollBy(1);
    }, [index]);

    const handlePrevPage = useCallback((): void => {
        // Reached the start
        if (index === 0) {
            return;
        }
        setIndex((index) => index - 1);
        swiperRef.current?.scrollBy(-1);
    }, [index]);

    const handleSelectCategory = useCallback(
        (
                state: Preference[],
                setState: Dispatch<SetStateAction<Preference[]>>
            ) =>
            (category: Preference) => {
                // Filter to see if this is a unselect
                const newState = state.filter(
                    (item) => item.id !== category.id
                );
                if (newState.length >= state.length) {
                    newState.push(category);
                }
                setState(newState);
            },
        []
    );

    const handleSubmitPreferences = async (): Promise<void> => {
        setLoading(true);
        // Save preferences
        try {
            await setUserPreferences({
                diets: selectedDiets.map((diet) => diet.id),
                cuisines: selectedCuisines.map((cuisine) => cuisine.id),
                allergens: selectedAllergens.map((allergen) => allergen.id),
            });
        } catch {
            Toast.show({ type: "error", text1: SET_PREF_FAILED });
            return;
        } finally {
            setLoading(false);
        }

        await storeData("haveUserSetPreference", true);
        // Show toast when done
        Toast.show({ type: "success", text1: SET_PREF_SUCCESS });
        // Redirect to Main Screens
        navigation.push("MainScreens");
    };

    return (
        <View className="flex-1">
            <Swiper
                scrollEnabled={false}
                ref={swiperRef}
                loop={false}
                showsPagination={false}
            >
                <PreferenceSection
                    categories={diets}
                    selectedCategories={selectedDiets}
                    setCategories={handleSelectCategory(
                        selectedDiets,
                        setSelectedDiets
                    )}
                    sectionDesc={SET_PREF_DIET_GUIDE}
                />
                <PreferenceSection
                    categories={cuisines}
                    selectedCategories={selectedCuisines}
                    setCategories={handleSelectCategory(
                        selectedCuisines,
                        setSelectedCuisines
                    )}
                    sectionDesc={SET_PREF_CUISINE_GUIDE}
                />
                <PreferenceSection
                    categories={allergens}
                    selectedCategories={selectedAllergens}
                    setCategories={handleSelectCategory(
                        selectedAllergens,
                        setSelectedAllergens
                    )}
                    sectionDesc={SET_PREF_ALLERGEN_GUIDE}
                />
            </Swiper>
            <Bar
                width={windowWidth}
                progress={progress}
                color={customColors.csecondary}
                borderWidth={0}
                unfilledColor={customColors.cgrey.platinum}
                borderRadius={0}
                animated={true}
            />
            <View className="my-4 mx-4 flex-row space-x-4">
                <TouchableOpacity
                    className="flex-1 px-4 py-2 rounded-lg bg-white items-center border"
                    activeOpacity={0.3}
                    onPress={handlePrevPage}
                >
                    <Text className="text-base text-gray-800">
                        {SET_PREF_PREV_BTN_TITLE}
                    </Text>
                </TouchableOpacity>
                {index < 2 && (
                    <TouchableOpacity
                        className="flex-1 px-4 py-2 rounded-lg bg-cprimary-300 items-center"
                        activeOpacity={0.3}
                        onPress={handleNextPage}
                    >
                        <Text className="text-base text-white">
                            {SET_PREF_NEXT_BTN_TITLE}
                        </Text>
                    </TouchableOpacity>
                )}
                {index === 2 && (
                    <TouchableOpacity
                        className="flex-1 px-4 py-2 rounded-lg bg-cprimary-300 items-center"
                        activeOpacity={0.3}
                        onPress={handleSubmitPreferences}
                        disabled={loading}
                    >
                        <Text className="text-base text-white">
                            {SET_PREF_DONE_BTN_TITLE}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default SetPreferences;

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
import { type RouteProp } from "@react-navigation/native";
import { type PreferenceObj } from "@/pages/create-post/create-recipe/types/PreferenceObj";
import { mapPreferenceObjToValue } from "@/pages/create-post/create-recipe/services/createRecipeService";

export type PreferenceItem = PreferenceResponse | { selected: boolean };

interface SetPreferencesProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SetPreferences">;
    route: RouteProp<RootStackParamList, "SetPreferences">;
}

const SetPreferences = ({
    navigation,
    route,
}: SetPreferencesProps): ReactElement<SetPreferencesProps> => {
    // Query all preferences and save to cache
    const { diets, cuisines, allergens, getAllPreferenceOptions } =
        useAppPreferences();
    const { getUserPreferences, setUserPreferences } = useUserPreferences();

    // Store selected preferences
    const [selectedDiets, setSelectedDiets] = useState<PreferenceObj>({});
    const [selectedCuisines, setSelectedCuisines] = useState<PreferenceObj>({});
    const [selectedAllergens, setSelectedAllergens] = useState<PreferenceObj>(
        {}
    );

    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const progress = useMemo(() => (index + 1) / 3, [index]);

    const swiperRef = useRef<Swiper>(null);

    const firstTime = useMemo(() => route.params.firstTime, [route]);

    const fetchUserPreferences = async (): Promise<void> => {
        const { diets, cuisines, allergens } = await getUserPreferences();
        setSelectedDiets(
            diets.reduce((acc: PreferenceObj, curr: string): PreferenceObj => {
                acc[curr] = true;
                return acc;
            }, {})
        );
        setSelectedCuisines(
            cuisines.reduce(
                (acc: PreferenceObj, curr: string): PreferenceObj => {
                    acc[curr] = true;
                    return acc;
                },
                {}
            )
        );
        setSelectedAllergens(
            allergens.reduce(
                (acc: PreferenceObj, curr: string): PreferenceObj => {
                    acc[curr] = true;
                    return acc;
                },
                {}
            )
        );
    };

    useEffect(() => {
        void getAllPreferenceOptions();
        if (firstTime) {
            return;
        }

        // Fetch current user preferences
        void fetchUserPreferences();
    }, []);

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

    const handleSelectDiets = useCallback((category: PreferenceResponse) => {
        setSelectedDiets((selected: PreferenceObj) => ({
            ...selected,
            [category.id]: !(selected[category.id] ?? false),
        }));
    }, []);

    const handleSelectCuisines = useCallback((category: PreferenceResponse) => {
        setSelectedCuisines((selected: PreferenceObj) => ({
            ...selected,
            [category.id]: !(selected[category.id] ?? false),
        }));
    }, []);

    const handleSelectAllergens = useCallback(
        (category: PreferenceResponse) => {
            setSelectedAllergens((selected: PreferenceObj) => ({
                ...selected,
                [category.id]: !(selected[category.id] ?? false),
            }));
        },
        []
    );

    const handleSubmitPreferences = async (): Promise<void> => {
        setLoading(true);
        // Save preferences

        try {
            await setUserPreferences({
                diets: mapPreferenceObjToValue(selectedDiets),
                cuisines: mapPreferenceObjToValue(selectedCuisines),
                allergens: mapPreferenceObjToValue(selectedAllergens),
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

        if (firstTime) {
            navigation.push("MainScreens");
        } else {
            navigation.goBack();
        }
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
                    setCategories={handleSelectDiets}
                    sectionDesc={SET_PREF_DIET_GUIDE}
                />
                <PreferenceSection
                    categories={cuisines}
                    selectedCategories={selectedCuisines}
                    setCategories={handleSelectCuisines}
                    sectionDesc={SET_PREF_CUISINE_GUIDE}
                />
                <PreferenceSection
                    categories={allergens}
                    selectedCategories={selectedAllergens}
                    setCategories={handleSelectAllergens}
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

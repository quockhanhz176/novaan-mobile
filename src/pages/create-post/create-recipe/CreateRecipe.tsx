import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    type ReactElement,
    useState,
    useMemo,
    useEffect,
    useCallback,
} from "react";
import { Bar } from "react-native-progress";
import React, { Text, TouchableOpacity, View } from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import {
    CREATE_RECIPE_FINISH_BUTTON_TITLE,
    CREATE_RECIPE_NEXT_STEP_BUTTON_TITLE,
    CREATE_RECIPE_PREVIOUS_STEP_BUTTON_TITLE,
    CREATE_RECIPE_SUBMIT,
    CREATE_RECIPE_TITLE,
    EDIT_RECIPE_PENDING,
    EDIT_RECIPE_SUBMIT,
    EDIT_RECIPE_TITLE,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import TitleDescriptionVideo from "../common/components/TitleDescriptionVideo";
import {
    NavigationContainer,
    type RouteProp,
    createNavigationContainerRef,
} from "@react-navigation/native";
import { type Asset } from "react-native-image-picker";
import {
    type RecipeStates,
    recipeInformationContext,
} from "./types/RecipeParams";
import PortionDificultyTime from "./components/PortionDifficultyTime";
import {
    handleRecipeEdit,
    handleRecipeSubmission,
} from "./services/createRecipeService";
import {
    type RootStackParamList,
    type RecipeTabParamList,
} from "@/types/navigation";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ViewIngredients from "./components/ingredients/pages/ViewIngredient";
import ViewInstruction from "./components/instructions/pages/ViewInstruction";
import { usePostInfo } from "@/api/post/PostApiHook";
import { useSWRConfig } from "swr";
import { useResourceUrl } from "@/api/utils/resourceHooks";
import type Instruction from "./types/Instruction";
import { getUserRecipesUrl } from "@/api/profile/ProfileApi";
import DietMealType from "./components/DietMealType";
import Cuisines from "./components/Cuisines";
import Allergens from "./components/Allergens";
import OverlayLoading from "@/common/components/OverlayLoading";
import { type PreferenceObj } from "./types/PreferenceObj";
import Toast from "react-native-toast-message";
import { getUserIdFromToken } from "@/api/common/utils/TokenUtils";

interface CreateRecipeProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "CreateTip">;
    route: RouteProp<RootStackParamList, "CreateTip">;
}

const RecipeTab = createMaterialTopTabNavigator<RecipeTabParamList>();
// const RecipeTab = createBottomTabNavigator<RecipeTabParamList>();

const recipeTabRef = createNavigationContainerRef<RecipeTabParamList>();

const CreateRecipe = ({
    navigation: rootNavigation,
    route,
}: CreateRecipeProps): ReactElement<CreateRecipeProps> => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState<Asset | null>(null);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState(-1);
    const [portionQuantity, setPortionQuantity] = useState(0);
    const [portionType, setPortionType] = useState(0);
    const [prepTime, setPrepTime] = useState({ hour: 0, minute: 0 });
    const [cookTime, setCookTime] = useState({ hour: 0, minute: 0 });
    const [instructions, setInstructions] = useState<
        RecipeStates["instructions"]
    >([]);
    const [ingredients, setIngredients] = useState<RecipeStates["ingredients"]>(
        []
    );

    const [diets, setDiets] = useState<PreferenceObj>({});
    const [mealTypes, setMealTypes] = useState<PreferenceObj>({});
    const [cuisines, setCuisines] = useState<PreferenceObj>({});
    const [allergens, setAllergens] = useState<PreferenceObj>({});

    const [currentScreen, setCurrentScreen] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const { postInfo, fetchPostInfo } = usePostInfo();
    const { fetchUrl } = useResourceUrl();

    const { mutate } = useSWRConfig();

    const isEditing: boolean = useMemo(
        () => route.params?.postId != null,
        [route.params]
    );

    useEffect(() => {
        if (route.params?.postId == null) {
            setIsLoading(false);
            return;
        }

        void fetchPostInfo({ postId: route.params.postId, postType: "Recipe" });
    }, []);

    const setEditPost = async (): Promise<void> => {
        if (postInfo === undefined) {
            return;
        }

        if (postInfo.type === "tip") {
            return;
        }

        const {
            title,
            description,
            thumbnail,
            difficulty,
            portionType,
            portionQuantity,
            prepTime,
            cookTime,
            instructions,
            ingredients,
            diets = [],
            mealTypes = [],
            cuisines = [],
            allergens = [],
        } = postInfo;

        const thumbnailUrl = await fetchUrl(thumbnail);

        setTitle(title);
        setDescription(description);
        setThumbnail(thumbnailUrl ?? null);
        setDifficulty(difficulty);
        setPortionType(portionType);
        setPortionQuantity(portionQuantity);
        setPrepTime(prepTime);
        setCookTime(cookTime);

        setDiets(
            diets.reduce((acc: PreferenceObj, curr: string): PreferenceObj => {
                acc[curr] = true;
                return acc;
            }, {})
        );
        setMealTypes(
            mealTypes.reduce(
                (acc: PreferenceObj, curr: string): PreferenceObj => {
                    acc[curr] = true;
                    return acc;
                },
                {}
            )
        );
        setCuisines(
            cuisines.reduce(
                (acc: PreferenceObj, curr: string): PreferenceObj => {
                    acc[curr] = true;
                    return acc;
                },
                {}
            )
        );
        setAllergens(
            allergens.reduce(
                (acc: PreferenceObj, curr: string): PreferenceObj => {
                    acc[curr] = true;
                    return acc;
                },
                {}
            )
        );

        setIngredients(
            ingredients.map((ingre, index) => ({ ...ingre, id: index }))
        );

        const formattedInstruction = await Promise.all(
            instructions.map(
                async (instruction, index): Promise<Instruction> => {
                    if (instruction.image == null) {
                        return {
                            ...instruction,
                            id: index,
                        };
                    }
                    const resourceUrl = await fetchUrl(instruction.image);
                    return {
                        ...instruction,
                        imageUri: resourceUrl,
                        id: index,
                    };
                }
            )
        );

        setInstructions(formattedInstruction);
        setIsLoading(false);
    };

    useEffect(() => {
        void setEditPost();
    }, [postInfo]);

    const paramList: RecipeTabParamList = {
        TitleDescriptionVideo: { labelType: "recipeParams" },
        PortionDificultyTime: undefined,
        Ingredients: undefined,
        Instructions: undefined,
        DietMealType: undefined,
        Cuisine: undefined,
        Allergen: undefined,
    };

    const screens = Object.keys(paramList);
    const progressStep = 1 / screens.length;

    const bottomNavButtonClassName =
        "flex-1 flex-row space-x-3 items-center justify-center rounded-full my-2 px-6 py-2";

    const progress = useMemo(
        () => (currentScreen + 1) * progressStep,
        [currentScreen]
    );

    const navigateBack = (): void => {
        rootNavigation.goBack();
    };

    const submitRecipe = async (): Promise<void> => {
        if (route.params?.postId == null) {
            await handleRecipeSubmission(
                {
                    title,
                    description,
                    video,
                    thumbnail,
                    difficulty,
                    portionQuantity,
                    portionType,
                    prepTime,
                    cookTime,
                    ingredients,
                    instructions,
                    diets,
                    mealTypes,
                    cuisines,
                    allergens,
                },
                () => {
                    navigateBack();
                }
            );
        } else {
            if (postInfo == null) {
                return;
            }

            await handleRecipeEdit(
                postInfo.id,
                postInfo.video,
                postInfo.thumbnail,
                {
                    title,
                    description,
                    video,
                    thumbnail,
                    difficulty,
                    portionQuantity,
                    portionType,
                    prepTime,
                    cookTime,
                    ingredients,
                    instructions,
                    diets,
                    mealTypes,
                    cuisines,
                    allergens,
                },
                () => {
                    Toast.show({ type: "info", text1: EDIT_RECIPE_PENDING });
                    navigateBack();
                }
            );
        }

        // Revalidate data and navigate back
        const currentUserId = await getUserIdFromToken();
        await mutate(
            // Only creator can edit their own post so it's safe to assume currentUserId === postInfo.creator.userId
            (key) =>
                Array.isArray(key) &&
                key[0] === getUserRecipesUrl(currentUserId)
        );
    };

    const goNextScreen = useCallback((): void => {
        if (currentScreen < screens.length - 1) {
            recipeTabRef.navigate(screens[currentScreen + 1] as any);
            setCurrentScreen((prevScreen) => prevScreen + 1);
        }
    }, [recipeTabRef, currentScreen]);

    const goPreviousScreen = useCallback((): void => {
        if (currentScreen > 0) {
            recipeTabRef.navigate(screens[currentScreen - 1] as any);
            setCurrentScreen((prevScreen) => prevScreen - 1);
        }
    }, [recipeTabRef, currentScreen]);

    const exit = (): void => {
        rootNavigation.pop();
    };

    if (isLoading) {
        return (
            <View className="flex-1">
                <OverlayLoading />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="h-[55] flex-row justify-between px-1">
                <View className="flex-row space-x-2 items-center">
                    <TouchableOpacity
                        onPress={exit}
                        activeOpacity={0.2}
                        className="h-10 w-10 items-center justify-center"
                    >
                        <IconEvill name="close" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-medium">
                        {isEditing ? EDIT_RECIPE_TITLE : CREATE_RECIPE_TITLE}
                    </Text>
                </View>
                <TouchableOpacity
                    className={
                        "flex-row space-x-2 items-center justify-center px-2"
                    }
                    onPress={submitRecipe}
                >
                    <IconAnt
                        name="upload"
                        color={customColors.cprimary["500"]}
                        size={18}
                    />
                    <Text className="text-sm font-semibold text-cprimary-500">
                        {isEditing ? EDIT_RECIPE_SUBMIT : CREATE_RECIPE_SUBMIT}
                    </Text>
                </TouchableOpacity>
            </View>
            <Bar
                width={null}
                progress={progress}
                color={customColors.csecondary}
                borderWidth={0}
                unfilledColor={customColors.cgrey.platinum}
                borderRadius={0}
                animated={true}
            />
            <recipeInformationContext.Provider
                value={{
                    isEditing,
                    title,
                    setTitle,
                    description,
                    setDescription,
                    video,
                    setVideo,
                    thumbnail,
                    setThumbnail,
                    difficulty,
                    setDifficulty,
                    portionType,
                    setPortionType,
                    portionQuantity,
                    setPortionQuantity,
                    prepTime,
                    setPrepTime,
                    cookTime,
                    setCookTime,
                    ingredients,
                    setIngredients,
                    instructions,
                    setInstructions,
                    diets,
                    setDiets,
                    mealTypes,
                    setMealTypes,
                    cuisines,
                    setCuisines,
                    allergens,
                    setAllergens,
                }}
            >
                <NavigationContainer independent={true} ref={recipeTabRef}>
                    <RecipeTab.Navigator
                        screenOptions={{
                            swipeEnabled: false,
                            tabBarShowLabel: false,
                            tabBarStyle: {
                                height: 0,
                            },
                        }}
                    >
                        <RecipeTab.Screen
                            name="TitleDescriptionVideo"
                            component={TitleDescriptionVideo}
                            initialParams={paramList.TitleDescriptionVideo}
                        />
                        <RecipeTab.Screen
                            name="PortionDificultyTime"
                            component={PortionDificultyTime}
                        />
                        <RecipeTab.Screen
                            name="Ingredients"
                            component={ViewIngredients}
                        />
                        <RecipeTab.Screen
                            name="Instructions"
                            component={ViewInstruction}
                        />
                        <RecipeTab.Screen
                            name="DietMealType"
                            component={DietMealType}
                        />
                        <RecipeTab.Screen name="Cuisine" component={Cuisines} />
                        <RecipeTab.Screen
                            name="Allergen"
                            component={Allergens}
                        />
                    </RecipeTab.Navigator>
                </NavigationContainer>
            </recipeInformationContext.Provider>
            <View
                className="flex-row justify-center items-center px-5
                border-cgrey-seasalt space-x-5"
                style={{ borderTopWidth: 2 }}
            >
                <TouchableOpacity
                    className={
                        bottomNavButtonClassName + " border border-cprimary-500"
                    }
                    delayPressIn={0}
                    onPress={goPreviousScreen}
                    activeOpacity={0.6}
                >
                    <IconAnt
                        name="arrowleft"
                        color={customColors.cprimary["500"]}
                        size={18}
                    />
                    <Text className="text-sm text-cprimary-500">
                        {CREATE_RECIPE_PREVIOUS_STEP_BUTTON_TITLE}
                    </Text>
                </TouchableOpacity>
                {currentScreen < screens.length - 1 ? (
                    <TouchableOpacity
                        className={
                            bottomNavButtonClassName + " bg-cprimary-500"
                        }
                        onPress={goNextScreen}
                    >
                        <Text className="text-sm text-white">
                            {CREATE_RECIPE_NEXT_STEP_BUTTON_TITLE}
                        </Text>
                        <IconAnt name="arrowright" color="white" size={18} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        className={
                            bottomNavButtonClassName + " bg-cprimary-300"
                        }
                        onPress={submitRecipe}
                    >
                        <Text className="text-sm text-white">
                            {CREATE_RECIPE_FINISH_BUTTON_TITLE}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default CreateRecipe;

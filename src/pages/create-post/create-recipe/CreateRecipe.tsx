import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type ReactElement, useState, useMemo } from "react";
import { Bar } from "react-native-progress";
import React, { Text, TouchableOpacity, View } from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import {
    CREATE_RECIPE_NEXT_STEP_BUTTON_TITLE,
    CREATE_RECIPE_PREVIOUS_STEP_BUTTON_TITLE,
    CREATE_RECIPE_SUBMIT,
    CREATE_RECIPE_TITLE,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import TitleDescriptionVideo from "../common/components/TitleDescriptionVideo";
import {
    NavigationContainer,
    createNavigationContainerRef,
} from "@react-navigation/native";
import { type Asset } from "react-native-image-picker";
import {
    type RecipeStates,
    recipeInformationContext,
} from "./types/RecipeParams";
import PortionDificultyTime from "./components/PortionDifficultyTime";
import { handleRecipeSubmission } from "./services/createRecipeService";
import Ingredient from "./components/ingredients/Ingredient";
import Instruction from "./components/instructions/Instruction";
import {
    type RootStackParamList,
    type RecipeTabParamList,
} from "@/types/navigation";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

interface CreateRecipeProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "CreateTip">;
}

const RecipeTab = createMaterialTopTabNavigator<RecipeTabParamList>();
// const RecipeTab = createBottomTabNavigator<RecipeTabParamList>();

const recipeTabRef = createNavigationContainerRef<RecipeTabParamList>();

const CreateRecipe = ({
    navigation: rootNavigation,
}: CreateRecipeProps): ReactElement<CreateRecipeProps> => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState<Asset | null>(null);
    const [difficulty, setDifficulty] = useState(-1);
    const [portionQuantity, setPortionQuantity] = useState(0);
    const [portionType, setPortionType] = useState(-1);
    const [prepTime, setPrepTime] = useState({ hour: 0, minute: 0 });
    const [cookTime, setCookTime] = useState({ hour: 0, minute: 0 });
    const [instructions, setInstructions] = useState<
        RecipeStates["instructions"]
    >([]);
    const [ingredients, setIngredients] = useState<RecipeStates["ingredients"]>(
        []
    );
    const [currentScreen, setCurrentScreen] = useState(0);

    const paramList: RecipeTabParamList = {
        TitleDescriptionVideo: { labelType: "recipeParams" },
        PortionDificultyTime: undefined,
        Ingredients: undefined,
        Instructions: undefined,
    };
    const screens = Object.keys(paramList);
    const progressStep = 1 / screens.length;

    const bottomNavButtonClassName =
        "flex-1 flex-row space-x-3 items-center justify-center rounded-full my-2 px-6 py-2";

    const progress = useMemo(
        () => (currentScreen + 1) * progressStep,
        [currentScreen]
    );

    const submitRecipe = async (): Promise<void> => {
        await handleRecipeSubmission(
            {
                title,
                description,
                video,
                difficulty,
                portionQuantity,
                portionType,
                prepTime,
                cookTime,
                ingredients,
                instructions,
            },
            () => {
                rootNavigation.pop();
            }
        );
    };

    const goNextScreen = (): void => {
        if (currentScreen < screens.length - 1) {
            recipeTabRef.navigate(screens[currentScreen + 1] as any);
            setCurrentScreen((prevScreen) => prevScreen + 1);
        }
    };

    const goPreviousScreen = (): void => {
        if (currentScreen > 0) {
            recipeTabRef.navigate(screens[currentScreen - 1] as any);
            setCurrentScreen((prevScreen) => prevScreen - 1);
        }
    };

    const exit = (): void => {
        rootNavigation.pop();
    };

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
                        {CREATE_RECIPE_TITLE}
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
                        {CREATE_RECIPE_SUBMIT}
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
                    title,
                    setTitle,
                    description,
                    setDescription,
                    video,
                    setVideo,
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
                }}
            >
                <NavigationContainer independent={true} ref={recipeTabRef}>
                    <RecipeTab.Navigator
                        screenOptions={{
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
                            component={Ingredient}
                        />
                        <RecipeTab.Screen
                            name="Instructions"
                            component={Instruction}
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
                        bottomNavButtonClassName +
                        " border-2 border-cprimary-500"
                    }
                    onPress={goPreviousScreen}
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
                <TouchableOpacity
                    className={bottomNavButtonClassName + " bg-cprimary-500"}
                    onPress={goNextScreen}
                >
                    <Text className="text-sm text-white">
                        {CREATE_RECIPE_NEXT_STEP_BUTTON_TITLE}
                    </Text>
                    <IconAnt name="arrowright" color="white" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateRecipe;

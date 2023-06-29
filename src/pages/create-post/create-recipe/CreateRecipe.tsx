import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type RootStackParamList } from "@root/App";
import { useState, type FC, useRef } from "react";
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
import TitleDescriptionVideo, {
    type TDVRouteProps,
} from "../common/components/TitleDescriptionVideo";
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
import Ingredients from "./components/Ingredients";
import Instructions from "./components/Instructions";
import { handleRecipeSubmission } from "./services/createRecipeService";

interface CreateRecipeProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "CreateTip">;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CreateRecipeTabParamList = {
    TitleDescriptionVideo: TDVRouteProps;
    PortionDificultyTime: undefined;
    Ingredients: {
        rootNavigation: NativeStackNavigationProp<
            RootStackParamList,
            "CreateTip"
        >;
    };
    Instructions: undefined;
};

const Tab = createMaterialTopTabNavigator<CreateRecipeTabParamList>();
const navigationRef = createNavigationContainerRef<CreateRecipeTabParamList>();

function navigate(name: keyof CreateRecipeTabParamList, params?: any): void {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

const CreateRecipe: FC<CreateRecipeProps> = ({
    navigation: rootNavigation,
}: CreateRecipeProps) => {
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

    // navigation
    const paramList: CreateRecipeTabParamList = {
        TitleDescriptionVideo: { labelType: "recipeParams" },
        PortionDificultyTime: undefined,
        Ingredients: { rootNavigation },
        Instructions: undefined,
    };
    const screens = Object.keys(paramList);
    const progressStep = 1 / screens.length;

    const bottomNavButtonClassName =
        "flex-1 flex-row space-x-3 items-center justify-center rounded-full my-2 px-6 py-2";

    // navigation
    const [progress, setProgresss] = useState(progressStep);
    const currentScreen = useRef(0);
    const routeNameRef = useRef("");

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
        if (currentScreen.current < screens.length - 1) {
            navigate(screens[currentScreen.current + 1] as any);
        }
    };

    const goPreviousScreen = (): void => {
        if (currentScreen.current > 0) {
            navigate(screens[currentScreen.current - 1] as any);
        }
    };

    const exit = (): void => {
        rootNavigation.pop();
    };

    const onNavigationStateChange = async (): Promise<void> => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef?.getCurrentRoute()?.name ?? "";

        if (previousRouteName !== currentRouteName) {
            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;
            const screenNumber = screens.findIndex((value) => {
                return value === currentRouteName;
            });
            currentScreen.current = screenNumber;
            setProgresss((screenNumber + 1) * progressStep);
        }
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
                <NavigationContainer
                    ref={navigationRef}
                    independent={true}
                    onReady={() => {
                        routeNameRef.current =
                            navigationRef?.getCurrentRoute()?.name ?? "";
                    }}
                    onStateChange={onNavigationStateChange}
                >
                    <Tab.Navigator
                        screenOptions={{
                            tabBarShowLabel: false,
                            tabBarStyle: {
                                height: 0,
                            },
                        }}
                    >
                        <Tab.Screen
                            name="TitleDescriptionVideo"
                            component={TitleDescriptionVideo}
                            initialParams={paramList.TitleDescriptionVideo}
                        />
                        <Tab.Screen
                            name="PortionDificultyTime"
                            component={PortionDificultyTime}
                        />
                        <Tab.Screen
                            name="Ingredients"
                            component={Ingredients}
                            initialParams={paramList.Ingredients}
                        />
                        <Tab.Screen
                            name="Instructions"
                            component={Instructions}
                        />
                    </Tab.Navigator>
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

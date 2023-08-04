import { type UserProfileRouteProps } from "@/pages/user-profile/UserProfile";

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    MainScreens: undefined;
    CreateTip: undefined;
    CreateRecipe: undefined;
    Greet: undefined;
    SetPreferences: undefined;
};

export type BottomTabParamList = {
    Home: undefined;
    Search: undefined;
    Reel: undefined;
    UserProfile: UserProfileRouteProps;
    CreatePostPopup: undefined;
};

export type BottomTabNavProp =
    MaterialBottomTabNavigationProp<BottomTabParamList>;

export type RecipeTabParamList = {
    TitleDescriptionVideo: TDVRouteProps;
    PortionDificultyTime: undefined;
    Ingredients: undefined;
    Instructions: undefined;
};

export type IngredientStackParamList = {
    ViewIngredient: undefined;
    AddIngredient: AddIngredientParams;
};

export type InstructionStackParamList = {
    ViewInstruction: undefined;
    AddInstruction: AddInstructionParams;
};

export type UserProfileTabParamList = {
    CreatedPosts: undefined;
    SavedPosts: undefined;
    Following: undefined;
};

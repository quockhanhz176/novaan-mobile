import { type SearchRouteProps } from "@/pages/search/Search";
import { type UserProfileRouteProps } from "@/pages/user-profile/UserProfile";

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    MainScreens: undefined;
    CreateTip: { postId?: string } | undefined;
    CreateRecipe: { postId?: string } | undefined;
    Greet: undefined;
    SetPreferences: { firstTime: boolean };
};

export type BottomTabParamList = {
    Home: undefined;
    Search: SearchRouteProps;
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
    DietMealType: undefined;
    Cuisine: undefined;
    Allergen: undefined;
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

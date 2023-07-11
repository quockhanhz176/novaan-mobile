import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { type ReactElement } from "react";
import ViewIngredients from "./pages/ViewIngredient";
import AddIngredient from "./pages/AddIngredient";
import { type IngredientStackParamList } from "@/types/navigation";

const IngredientStack = createNativeStackNavigator<IngredientStackParamList>();

const Ingredient = (): ReactElement => {
    return (
        <IngredientStack.Navigator initialRouteName="ViewIngredient">
            <IngredientStack.Screen
                name="ViewIngredient"
                options={{
                    headerShown: false,
                    animation: "slide_from_right",
                    animationDuration: 100,
                }}
                component={ViewIngredients}
            />
            <IngredientStack.Screen
                name="AddIngredient"
                component={AddIngredient}
            />
        </IngredientStack.Navigator>
    );
};

export default Ingredient;

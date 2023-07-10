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
                }}
                component={ViewIngredients}
            />
            <IngredientStack.Screen
                name="AddIngredient"
                component={AddIngredient}
                options={{
                    animation: "slide_from_bottom",
                    animationDuration: 200,
                }}
            />
        </IngredientStack.Navigator>
    );
};

export default Ingredient;

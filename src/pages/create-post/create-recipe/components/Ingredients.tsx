import React, { type FC, useContext, useRef, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { recipeInformationContext } from "../types/RecipeParams";
import type Ingredient from "../types/Ingredient";
import { rootNavigate } from "@root/App";
import IngredientItem from "./IngredientItem";
import {
    CREATE_RECIPE_INGREDIENTS_SUBTITLE,
    CREATE_RECIPE_INGREDIENTS_ADD_INGREDIENT_BUTTON_TITLE,
    CREATE_RECIPE_INGREDIENTS_TITLE,
} from "@/common/strings";
import WarningAsterisk from "@/common/components/WarningAeterisk";
import IconAnt from "react-native-vector-icons/AntDesign";
import { customColors } from "@root/tailwind.config";

const Ingredients: FC = () => {
    const { ingredients, setIngredients } = useContext(
        recipeInformationContext
    );
    const [refresh, setRefresh] = useState(true);
    const labelClassName = "text-base font-medium uppercase";
    const id = useRef(0);

    const resetList = (): void => {
        setRefresh(!refresh);
    };

    const addIngredient = (ingredient: Ingredient): void => {
        ingredient.id = id.current++;
        setIngredients([...ingredients, ingredient]);
    };

    const editIngredient = (ingredient: Ingredient): void => {
        const index = ingredients.findIndex((i) => i.id === ingredient.id);
        if (index === -1) {
            return;
        }

        ingredients.splice(index, 1, ingredient);
        setIngredients(ingredients);
        resetList();
    };

    const openAddIngredient = (): void => {
        rootNavigate("AddIngredient", {
            information: { type: "add" },
            submitIngredient: addIngredient,
        });
    };

    const openEditIngredient = (ingredient: Ingredient): void => {
        rootNavigate("AddIngredient", {
            information: { type: "edit", ingredient },
            submitIngredient: editIngredient,
        });
    };

    const deleteIngredient = (id: number): void => {
        const index = ingredients.findIndex((i) => i.id === id);
        if (index === -1) {
            return;
        }

        ingredients.splice(index, 1);
        setIngredients(ingredients);
        resetList();
    };

    return (
        <FlatList
            keyboardShouldPersistTaps="handled"
            className="bg-white"
            ListHeaderComponent={
                <View>
                    <Text className="text-base p-5 bg-ctertiary ">
                        {CREATE_RECIPE_INGREDIENTS_SUBTITLE}
                    </Text>
                    <Text className={labelClassName + " mt-6 mx-3"}>
                        {CREATE_RECIPE_INGREDIENTS_TITLE}
                        <WarningAsterisk />
                    </Text>
                </View>
            }
            ListFooterComponent={
                ingredients.length < 9999 ? (
                    <TouchableOpacity
                        onPress={openAddIngredient}
                        className="flex-row space-x-2 justify-center items-center p-3
                         border-cprimary-500 rounded-full mx-5 my-7"
                        style={{ borderWidth: 1 }}
                    >
                        <IconAnt
                            name="plus"
                            size={25}
                            color={customColors.cprimary["500"]}
                        />
                        <Text className=" text-cprimary-500 text-base font-medium">
                            {
                                CREATE_RECIPE_INGREDIENTS_ADD_INGREDIENT_BUTTON_TITLE
                            }
                        </Text>
                    </TouchableOpacity>
                ) : null
            }
            data={ingredients}
            renderItem={(item) => (
                <IngredientItem
                    ingredient={item.item}
                    onDeletePress={() => {
                        deleteIngredient(item.item.id);
                    }}
                    onEditPress={() => {
                        openEditIngredient(item.item);
                    }}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            extraData={refresh}
        />
    );
};

export default Ingredients;

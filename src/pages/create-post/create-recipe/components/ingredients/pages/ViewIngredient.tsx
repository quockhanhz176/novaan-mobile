import React, {
    useContext,
    type ReactElement,
    useState,
    useCallback,
} from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { recipeInformationContext } from "../../../types/RecipeParams";
import type Ingredient from "../../../types/Ingredient";
import IngredientItem from "../components/IngredientItem";
import {
    CREATE_RECIPE_INGREDIENTS_SUBTITLE,
    CREATE_RECIPE_INGREDIENTS_ADD_INGREDIENT_BUTTON_TITLE,
    CREATE_RECIPE_INGREDIENTS_TITLE,
} from "@/common/strings";
import WarningAsterisk from "@/common/components/WarningAeterisk";
import IconAnt from "react-native-vector-icons/AntDesign";
import { customColors } from "@root/tailwind.config";
import AddIngredient from "./AddIngredient";
import { type Undefinable } from "@/types/app";

const ViewIngredients = (): ReactElement => {
    const { isEditing, ingredients, setIngredients } = useContext(
        recipeInformationContext
    );
    const [selectedIngredient, setSelectedIngredient] =
        useState<Undefinable<Ingredient>>(undefined);
    const [showAddIngredient, setShowAddIngredient] = useState(false);

    const labelClassName = "text-base font-medium uppercase";

    const openAddIngredient = (): void => {
        setShowAddIngredient(true);
    };

    const openEditIngredient = (ingredient: Ingredient): void => {
        setSelectedIngredient(ingredient);
        setShowAddIngredient(true);
    };

    const deleteIngredient = (id: number): void => {
        setIngredients((ings) => {
            const index = ings.findIndex((i) => i.id === id);
            if (index === -1) {
                return ings;
            }

            ings.splice(index, 1);
            return [...ings];
        });
    };

    const handleCloseAddIngredient = (): void => {
        setSelectedIngredient(undefined);
        setShowAddIngredient(false);
    };

    const renderItem = useCallback(({ item }: { item: Ingredient }) => {
        return (
            <IngredientItem
                ingredient={item}
                onDeletePress={() => {
                    deleteIngredient(item.id);
                }}
                onEditPress={() => {
                    openEditIngredient(item);
                }}
            />
        );
    }, []);

    return (
        <>
            <FlatList
                keyboardShouldPersistTaps="handled"
                className="bg-white"
                ListHeaderComponent={
                    <View>
                        {!isEditing && (
                            <Text className="text-base p-5 bg-ctertiary">
                                {CREATE_RECIPE_INGREDIENTS_SUBTITLE}
                            </Text>
                        )}
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
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <AddIngredient
                ingredient={selectedIngredient}
                isShown={showAddIngredient}
                onClose={handleCloseAddIngredient}
            />
        </>
    );
};

export default ViewIngredients;

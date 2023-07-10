import { type FC } from "react";
import type Ingredient from "../../../types/Ingredient";
import React, { Text, TouchableOpacity, View } from "react-native";
import IconFA from "react-native-vector-icons/FontAwesome5";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";

interface IngredientItemProps {
    ingredient: Ingredient;
    onEditPress?: (ingredient: Ingredient) => void;
    onDeletePress?: (ingredient: Ingredient) => void;
}

const IngredientItem: FC<IngredientItemProps> = ({
    ingredient,
    onEditPress,
    onDeletePress,
}: IngredientItemProps) => {
    const onEdit = (): void => {
        onEditPress?.(ingredient);
    };
    const onDelete = (): void => {
        onDeletePress?.(ingredient);
    };

    return (
        <View className="flex-row justify-between items-center p-3 space-x-10">
            <View className="flex-row space-x-3 items-center">
                <IconMaterial name="equal" size={25} />
                <Text className="w-[200]" numberOfLines={1}>
                    {`${ingredient.amount.toString()} ${ingredient.unit} ${
                        ingredient.name
                    }`}
                </Text>
            </View>
            <View className="flex-row space-x-3 items-center">
                <TouchableOpacity onPress={onEdit}>
                    <IconFA name="edit" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                    <IconFA name="trash" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default IngredientItem;

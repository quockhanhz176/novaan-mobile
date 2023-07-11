import WarningAsterisk from "@/common/components/WarningAeterisk";
import {
    ADD_INGREDIENT_AMOUNT_TITLE,
    ADD_INGREDIENT_INGREDIENT_TITLE,
    ADD_INGREDIENT_MESSAGE_TITLE,
    ADD_INGREDIENT_NO_NAME_ERROR,
    ADD_INGREDIENT_NO_UNIT_ERROR,
    ADD_INGREDIENT_SUBMIT_BUTTON_TITLE,
    ADD_INGREDIENT_TITLE,
    ADD_INGREDIENT_UNIT_TITLE,
    ADD_INGREDIENT_ZERO_AMOUNT_ERROR,
} from "@/common/strings";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, type ReactElement, useContext } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import type Ingredient from "../../../types/Ingredient";
import { type IngredientStackParamList } from "@/types/navigation";
import { recipeInformationContext } from "../../../types/RecipeParams";

export interface AddIngredientParams {
    information:
        | {
              type: "add";
          }
        | {
              type: "edit";
              ingredient: Ingredient;
          };
}

interface AddIngredentProps {
    route: {
        params: AddIngredientParams;
    };
    navigation: NativeStackNavigationProp<
        IngredientStackParamList,
        "AddIngredient"
    >;
}

const AddIngredient = ({
    route: {
        params: { information },
    },
    navigation,
}: AddIngredentProps): ReactElement<AddIngredentProps> => {
    const { ingredients, setIngredients } = useContext(
        recipeInformationContext
    );
    const [name, setName] = useState(
        information.type === "edit" ? information.ingredient.name : ""
    );
    const [amount, setAmount] = useState<number>(
        information.type === "edit" ? information.ingredient.amount : 1
    );
    const [unit, setUnit] = useState<string>(
        information.type === "edit" ? information.ingredient.unit : ""
    );

    const labelClassName = "text-base font-medium uppercase";

    const navigateBack = (): void => {
        navigation.goBack();
    };

    const addIngredient = (ingredient: Ingredient): void => {
        ingredient.id = ingredients.length;
        setIngredients([...ingredients, ingredient]);
    };

    const editIngredient = (ingredient: Ingredient): void => {
        const index = ingredients.findIndex((i) => i.id === ingredient.id);
        if (index === -1) {
            return;
        }

        ingredients.splice(index, 1, ingredient);
        setIngredients(ingredients);
    };

    const onAmountChange = (amount: string): void => {
        const numberAmount = parseFloat(amount);
        if (Number.isNaN(numberAmount)) {
            setAmount(1);
            return;
        }
        setAmount(numberAmount);
    };

    const submit = (): void => {
        const error = (message: string): void => {
            Alert.alert(ADD_INGREDIENT_MESSAGE_TITLE, message);
        };

        if (name === "") {
            error(ADD_INGREDIENT_NO_NAME_ERROR);
            return;
        }

        if (amount === 0) {
            error(ADD_INGREDIENT_ZERO_AMOUNT_ERROR);
            return;
        }

        if (unit === "") {
            error(ADD_INGREDIENT_NO_UNIT_ERROR);
            return;
        }

        const inputIngredient: Ingredient = {
            id: ingredients.length,
            amount,
            name,
            unit,
        };
        if (information.type === "add") {
            addIngredient(inputIngredient);
        } else {
            inputIngredient.id = information.ingredient.id;
            editIngredient(inputIngredient);
        }
        navigateBack();
    };

    return (
        <Modal animationType="slide">
            <ScrollView>
                <View className="h-[55] flex-row items-center justify-between px-1 border-b-2 border-cgrey-platinum">
                    <View className="flex-row space-x-2 items-center">
                        <TouchableOpacity
                            onPress={navigateBack}
                            activeOpacity={0.2}
                            className="h-10 w-10 items-center justify-center"
                        >
                            <IconEvill name="close" size={25} color="#000" />
                        </TouchableOpacity>
                        <Text className="text-xl font-medium">
                            {ADD_INGREDIENT_TITLE}
                        </Text>
                    </View>
                    <TouchableOpacity className="px-3" onPress={submit}>
                        <Text className="text-lg font-bold text-cprimary-500">
                            {ADD_INGREDIENT_SUBMIT_BUTTON_TITLE}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="px-6 py-7 mt-4">
                    <Text className={labelClassName}>
                        {ADD_INGREDIENT_INGREDIENT_TITLE}
                        <WarningAsterisk />
                    </Text>
                    <TextInput
                        autoCapitalize="none"
                        value={name}
                        textAlignVertical="top"
                        onChangeText={setName}
                        maxLength={55}
                        className="text-base py-2 first-line:border-cgrey-platinum"
                        // classname doesn't work
                        style={{ borderBottomWidth: 1 }}
                    />
                    <View className="items-end">
                        <Text className="text-cgrey-dim text-base">
                            {name.length.toString() + "/50"}
                        </Text>
                    </View>
                    <View className="flex-row space-x-4 mt-14">
                        <View className="flex-1">
                            <Text className={labelClassName}>
                                {ADD_INGREDIENT_AMOUNT_TITLE}
                                <WarningAsterisk />
                            </Text>
                            <TextInput
                                keyboardType="decimal-pad"
                                defaultValue={amount?.toString() ?? ""}
                                textAlignVertical="top"
                                onChangeText={onAmountChange}
                                maxLength={500}
                                className="text-base py-2 w-full first-line:border-cgrey-platinum"
                                // classname doesn't work
                                style={{ borderBottomWidth: 1 }}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className={labelClassName}>
                                {ADD_INGREDIENT_UNIT_TITLE}
                                <WarningAsterisk />
                            </Text>
                            <TextInput
                                autoCapitalize="none"
                                maxLength={500}
                                value={unit}
                                onChangeText={setUnit}
                                className="text-base py-2 w-full first-line:border-cgrey-platinum border-b"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    );
};

export default AddIngredient;

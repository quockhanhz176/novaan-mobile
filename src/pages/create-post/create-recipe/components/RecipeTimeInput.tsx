import { CREATE_RECIPE_HOUR, CREATE_RECIPE_MINUTE } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { useState, type FC } from "react";
import React, { Text, TextInput, View } from "react-native";

interface RecipeTimeInputProps {
    onHourChange?: (value: number) => void;
    onMinuteChange?: (value: number) => void;
}
const MAX_HOUR = 72;
const MAX_MINUTE = 59;

const RecipeTimeInput: FC<RecipeTimeInputProps> = ({
    onHourChange,
    onMinuteChange,
}: RecipeTimeInputProps) => {
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");

    const checkNumberInput = (
        text: string,
        setter: (value: string) => void,
        minValue: number,
        maxValue: number,
        onValueChange?: (value: number) => void
    ): void => {
        if (text === "") {
            setter("");
            onValueChange?.(0);
            return;
        }
        let value = parseFloat(text);
        if (Number.isNaN(value)) {
            value = 0;
        } else if (value > maxValue) {
            value = maxValue;
        } else if (value < minValue) {
            value = minValue;
        }
        setter(value.toString());
        onValueChange?.(value);
    };

    const onHourTextChange = (text: string): void => {
        checkNumberInput(text, setHour, 0, MAX_HOUR, onHourChange);
    };
    const onMinuteTextChange = (text: string): void => {
        checkNumberInput(text, setMinute, 0, MAX_MINUTE, onMinuteChange);
    };

    return (
        <View className="flex-row space-x-2 items-center">
            <TextInput
                textAlign={"center"}
                keyboardType="number-pad"
                placeholder="0"
                value={hour}
                placeholderTextColor={customColors.cgrey.battleship}
                onChangeText={onHourTextChange}
                className="text-base py-2 border-cgrey-platinum w-[50] bg-cgrey-seasalt rounded-md text-cgrey-battleship"
            />
            <Text>{CREATE_RECIPE_HOUR}</Text>
            <TextInput
                textAlign={"center"}
                keyboardType="number-pad"
                placeholder="0"
                value={minute}
                placeholderTextColor={customColors.cgrey.battleship}
                onChangeText={onMinuteTextChange}
                className="text-base py-2 border-cgrey-platinum w-[50] bg-cgrey-seasalt rounded-md text-cgrey-battleship"
            />
            <Text>{CREATE_RECIPE_MINUTE}</Text>
        </View>
    );
};

export default RecipeTimeInput;

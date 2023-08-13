import { CREATE_RECIPE_HOUR, CREATE_RECIPE_MINUTE } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { useState, type FC, useEffect, type LegacyRef } from "react";
import React, { Text, TextInput, View } from "react-native";
import type RecipeTime from "../types/RecipeTime";

interface RecipeTimeInputProps {
    value?: RecipeTime;
    onHourChange?: (value: number) => void;
    onMinuteChange?: (value: number) => void;
    hourInputRef?: LegacyRef<TextInput>;
    minuteInputRef?: LegacyRef<TextInput>;
}
const MAX_HOUR = 72;
const MAX_MINUTE = 59;

const RecipeTimeInput: FC<RecipeTimeInputProps> = ({
    value,
    onHourChange,
    onMinuteChange,
    hourInputRef,
    minuteInputRef,
}: RecipeTimeInputProps) => {
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");

    useEffect(() => {
        if (value == null) {
            return;
        }

        if (value.hour > 0) {
            setHour(value.hour.toString());
        }

        if (value.minute > 0) {
            setMinute(value.minute.toString());
        }
    }, [value]);

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
                ref={hourInputRef}
                textAlign={"center"}
                keyboardType="number-pad"
                placeholder="0"
                value={hour}
                placeholderTextColor={customColors.cgrey.battleship}
                onChangeText={onHourTextChange}
                className="text-base py-2 border-cgrey-platinum w-[50] bg-cgrey-seasalt rounded-md"
            />
            <Text>{CREATE_RECIPE_HOUR}</Text>
            <TextInput
                ref={minuteInputRef}
                textAlign={"center"}
                keyboardType="number-pad"
                placeholder="0"
                value={minute}
                placeholderTextColor={customColors.cgrey.battleship}
                onChangeText={onMinuteTextChange}
                className="text-base py-2 border-cgrey-platinum w-[50] bg-cgrey-seasalt rounded-md"
            />
            <Text>{CREATE_RECIPE_MINUTE}</Text>
        </View>
    );
};

export default RecipeTimeInput;

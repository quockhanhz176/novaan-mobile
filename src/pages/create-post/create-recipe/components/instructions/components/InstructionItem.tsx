import { type FC } from "react";
import type Instruction from "../../../types/Instruction";
import React, { Image, Text, TouchableOpacity, View } from "react-native";
import IconFA from "react-native-vector-icons/FontAwesome5";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import { CREATE_RECIPE_INSTRUCTIONS_INSTRUCTION_TEXT } from "@/common/strings";
import IconEntypo from "react-native-vector-icons/Entypo";

interface InstructionItemProps {
    instruction: Instruction;
    onEditPress?: (instruction: Instruction) => void;
    onDeletePress?: (instruction: Instruction) => void;
}

const InstructionItem: FC<InstructionItemProps> = ({
    instruction,
    onEditPress,
    onDeletePress,
}: InstructionItemProps) => {
    const onEdit = (): void => {
        onEditPress?.(instruction);
    };
    const onDelete = (): void => {
        onDeletePress?.(instruction);
    };

    return (
        <View className="flex-row justify-between items-center p-3 space-x-4">
            <View className="flex-row space-x-3 items-center">
                <IconMaterial name="equal" size={25} />
                <View className="h-[70] w-[70] justify-center items-center overflow-hidden rounded">
                    {instruction.imageUri != null ? (
                        <Image
                            source={{ uri: instruction.imageUri }}
                            className="w-full h-full"
                        />
                    ) : (
                        <IconEntypo name="image" size={30} />
                    )}
                </View>
                <View className="align-center">
                    <Text className="font-medium">
                        {CREATE_RECIPE_INSTRUCTIONS_INSTRUCTION_TEXT +
                            instruction.step.toString()}
                    </Text>
                    <Text className="w-[200]" numberOfLines={1}>
                        {instruction.description}
                    </Text>
                </View>
            </View>
            <View className="flex-row space-x-3 items-start h-full">
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

export default InstructionItem;

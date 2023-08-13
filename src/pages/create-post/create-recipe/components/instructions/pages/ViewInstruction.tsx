import React, {
    useState,
    type ReactElement,
    useContext,
    useCallback,
} from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import {
    CREATE_RECIPE_INSTRUCTIONS_SUBTITLE,
    CREATE_RECIPE_INSTRUCTIONS_ADD_INGREDIENT_BUTTON_TITLE,
    CREATE_RECIPE_INSTRUCTIONS_TITLE,
} from "@/common/strings";
import WarningAsterisk from "@/common/components/WarningAeterisk";
import IconAnt from "react-native-vector-icons/AntDesign";
import { customColors } from "@root/tailwind.config";
import type Instruction from "../../../types/Instruction";
import InstructionItem from "../components/InstructionItem";
import { recipeInformationContext } from "../../../types/RecipeParams";
import { type Undefinable } from "@/types/app";
import AddInstruction from "./AddInstruction";
import useBooleanHook from "@/common/components/BooleanHook";

const ViewInstruction = (): ReactElement => {
    const { isEditing, instructions, setInstructions } = useContext(
        recipeInformationContext
    );
    const [selectedInstruction, setSelectedInstruction] =
        useState<Undefinable<Instruction>>(undefined);
    const [addInstructionShown, hideAddInstruction, showAddInstruction] =
        useBooleanHook();

    const labelClassName = "text-base font-medium uppercase";

    const openEditInstruction = useCallback(
        (instruction: Instruction): void => {
            setSelectedInstruction(instruction);
            showAddInstruction();
        },
        []
    );

    const deleteInstruction = useCallback((id: number): void => {
        setInstructions((ins) => {
            console.log("delete", id);
            console.log("instructions", ins);
            const index = ins.findIndex((s) => s.id === id);
            if (index === -1) {
                return ins;
            }

            ins.splice(index, 1);
            ins.forEach((_, i, ins) => {
                if (i < index) {
                    return;
                }
                ins[i].step--;
            });
            return [...ins];
        });
    }, []);

    const handleCloseAddInstruction = useCallback((): void => {
        setSelectedInstruction(undefined);
        hideAddInstruction();
    }, []);

    const onDeletePress = useCallback(
        (instruction: Instruction) => {
            deleteInstruction(instruction.id);
        },
        [deleteInstruction]
    );

    const onEditPress = useCallback((instruction: Instruction) => {
        openEditInstruction(instruction);
    }, []);

    const renderItem = useCallback(({ item }: { item: Instruction }) => {
        return (
            <InstructionItem
                instruction={item}
                onDeletePress={onDeletePress}
                onEditPress={onEditPress}
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
                            <Text className="text-base p-5 bg-ctertiary ">
                                {CREATE_RECIPE_INSTRUCTIONS_SUBTITLE}
                            </Text>
                        )}
                        <Text className={labelClassName + " mt-6 mx-3"}>
                            {CREATE_RECIPE_INSTRUCTIONS_TITLE}
                            <WarningAsterisk />
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    instructions.length < 20 ? (
                        <TouchableOpacity
                            onPress={showAddInstruction}
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
                                    CREATE_RECIPE_INSTRUCTIONS_ADD_INGREDIENT_BUTTON_TITLE
                                }
                            </Text>
                        </TouchableOpacity>
                    ) : null
                }
                data={instructions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <AddInstruction
                instruction={selectedInstruction}
                isShown={addInstructionShown}
                onClose={handleCloseAddInstruction}
            />
        </>
    );
};

export default ViewInstruction;

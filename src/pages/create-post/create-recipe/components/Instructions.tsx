import React, { type FC, useContext, useRef, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { recipeInformationContext } from "../types/RecipeParams";
import { rootNavigate } from "@root/App";
import {
    CREATE_RECIPE_INSTRUCTIONS_SUBTITLE,
    CREATE_RECIPE_INSTRUCTIONS_ADD_INGREDIENT_BUTTON_TITLE,
    CREATE_RECIPE_INSTRUCTIONS_TITLE,
} from "@/common/strings";
import WarningAsterisk from "@/common/components/WarningAeterisk";
import IconAnt from "react-native-vector-icons/AntDesign";
import { customColors } from "@root/tailwind.config";
import type Instruction from "../types/Instruction";
import InstructionItem from "./InstructionItem";

const Instructions: FC = () => {
    const { instructions, setInstructions } = useContext(
        recipeInformationContext
    );
    const [refresh, setRefresh] = useState(true);
    const labelClassName = "text-base font-medium uppercase";
    const id = useRef(0);
    const lastInstruction = useRef(0);

    const resetList = (): void => {
        setRefresh(!refresh);
    };

    const addInstruction = (instruction: Instruction): void => {
        instruction.id = id.current++;
        instruction.step = ++lastInstruction.current;
        setInstructions([...instructions, instruction]);
        resetList();
    };

    const editInstruction = (instruction: Instruction): void => {
        const index = instructions.findIndex((s) => s.id === instruction.id);
        if (index === -1) {
            return;
        }

        instructions.splice(index, 1, instruction);
        setInstructions(instructions);
        resetList();
    };

    const openAddInstruction = (): void => {
        rootNavigate("AddInstruction", {
            information: { type: "add" },
            submitInstruction: addInstruction,
        });
    };

    const openEditInstruction = (instruction: Instruction): void => {
        rootNavigate("AddInstruction", {
            information: { type: "edit", instruction },
            submitInstruction: editInstruction,
        });
    };

    const deleteInstruction = (id: number): void => {
        const index = instructions.findIndex((s) => s.id === id);
        if (index === -1) {
            return;
        }

        instructions.splice(index, 1);
        instructions.forEach((instruction, i, instructions) => {
            if (i >= index) {
                instructions[i].step--;
            }
        });
        lastInstruction.current--;

        setInstructions(instructions);
        resetList();
    };

    return (
        <FlatList
            keyboardShouldPersistTaps="handled"
            className="bg-white"
            ListHeaderComponent={
                <View>
                    <Text className="text-base p-5 bg-ctertiary ">
                        {CREATE_RECIPE_INSTRUCTIONS_SUBTITLE}
                    </Text>
                    <Text className={labelClassName + " mt-6 mx-3"}>
                        {CREATE_RECIPE_INSTRUCTIONS_TITLE}
                        <WarningAsterisk />
                    </Text>
                </View>
            }
            ListFooterComponent={
                instructions.length < 20 ? (
                    <TouchableOpacity
                        onPress={openAddInstruction}
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
            renderItem={(item) => (
                <InstructionItem
                    instruction={item.item}
                    onDeletePress={() => {
                        deleteInstruction(item.item.id);
                    }}
                    onEditPress={() => {
                        openEditInstruction(item.item);
                    }}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            extraData={refresh}
        />
    );
};

export default Instructions;

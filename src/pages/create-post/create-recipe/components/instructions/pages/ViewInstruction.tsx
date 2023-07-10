import React, { useRef, useState, type ReactElement, useContext } from "react";
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
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type InstructionStackParamList } from "@/types/navigation";
import { recipeInformationContext } from "../../../types/RecipeParams";

interface ViewInstructionsProp {
    navigation: NativeStackNavigationProp<
        InstructionStackParamList,
        "ViewInstruction"
    >;
}

const ViewInstruction = ({
    navigation,
}: ViewInstructionsProp): ReactElement<ViewInstructionsProp> => {
    const { instructions, setInstructions } = useContext(
        recipeInformationContext
    );
    const [refresh, setRefresh] = useState(true);
    const labelClassName = "text-base font-medium uppercase";
    const lastInstruction = useRef(0);

    const resetList = (): void => {
        setRefresh(!refresh);
    };

    const openAddInstruction = (): void => {
        navigation.navigate("AddInstruction", {
            information: { type: "add" },
        });
    };

    const openEditInstruction = (instruction: Instruction): void => {
        navigation.navigate("AddInstruction", {
            information: { type: "edit", instruction },
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

export default ViewInstruction;

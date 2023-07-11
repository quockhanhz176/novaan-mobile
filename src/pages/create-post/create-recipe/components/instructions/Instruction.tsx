import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { type ReactElement } from "react";
import ViewInstruction from "./pages/ViewInstruction";
import AddInstruction from "./pages/AddInstruction";
import { type InstructionStackParamList } from "@/types/navigation";

const InstructionStack =
    createNativeStackNavigator<InstructionStackParamList>();

const Instruction = (): ReactElement => {
    return (
        <InstructionStack.Navigator initialRouteName="ViewInstruction">
            <InstructionStack.Screen
                name="ViewInstruction"
                options={{
                    headerShown: false,
                }}
                component={ViewInstruction}
            />
            <InstructionStack.Screen
                name="AddInstruction"
                component={AddInstruction}
            />
        </InstructionStack.Navigator>
    );
};

export default Instruction;

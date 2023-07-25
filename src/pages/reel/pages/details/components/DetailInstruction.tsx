import { type FC } from "react";
import React, {
    View,
    Text,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import { REEL_DETAILS_INSTRUCTION_TITLE } from "@/common/strings";
import { type Instruction } from "@/api/post/types/PostResponse";
import ResourceImage from "@/common/components/ResourceImage";

interface InstructionProps {
    instruction: Instruction;
    instructionCount: number;
    style?: StyleProp<ViewStyle>;
}

const DetailInstruction: FC<InstructionProps> = ({
    instruction,
    instructionCount,
    style,
}) => {
    return (
        <View style={style}>
            <View className="bg-ctertiary px-5 py-4">
                <Text className="font-semibold text-base uppercase">
                    {`${REEL_DETAILS_INSTRUCTION_TITLE} ${instruction.step.toString()}/${instructionCount.toString()}`}
                </Text>
            </View>
            {instruction.image != null && (
                <ResourceImage resourceId={instruction.image} />
            )}
            <View className="p-5">
                <Text className="text-base">{instruction.description}</Text>
            </View>
        </View>
    );
};

export default DetailInstruction;

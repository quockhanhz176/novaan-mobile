import { customColors } from "@root/tailwind.config";
import React, { memo, type FC } from "react";
import { Text, TouchableHighlight } from "react-native";

interface SuggestedIngredientItemProps {
    value: string;
    onItemPressed: (value: string) => void;
}

const SuggestedIngredientItem: FC<SuggestedIngredientItemProps> = ({
    value,
    onItemPressed,
}) => {
    const onPressed = (): void => {
        onItemPressed(value);
    };
    return (
        <TouchableHighlight
            onPress={onPressed}
            className="px-4 py-1 bg-white"
            underlayColor={customColors.ctertiary}
        >
            <Text className="text-cgrey-dim text-base">{value}</Text>
        </TouchableHighlight>
    );
};

export default memo(SuggestedIngredientItem);

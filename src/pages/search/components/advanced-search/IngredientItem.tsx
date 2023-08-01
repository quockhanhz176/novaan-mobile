import IconLabelButton from "@/common/components/IconLabelButton";
import { type FC, memo } from "react";
import React, {
    View,
    Text,
    type StyleProp,
    type ViewStyle,
} from "react-native";

interface IngredientItemProps {
    name: string;
    onDelete: (name: string) => void;
    style?: StyleProp<ViewStyle>;
}

const IngredientItem: FC<IngredientItemProps> = ({ name, onDelete, style }) => {
    const onDeletePressed = (): void => {
        onDelete(name);
    };

    return (
        <View className="p-[2]">
            <View
                className="flex-row h-8 rounded-full items-center bg-cprimary-200 overflow-hidden"
                style={style}
            >
                <Text className="pl-3 text-white text-xs font-semibold">
                    {name}
                </Text>
                <IconLabelButton
                    buttonClassName="space-x-0 p-2 pr-3"
                    iconPack="Ant"
                    iconProps={{ name: "close", color: "white", size: 14 }}
                    buttonProps={{ onPress: onDeletePressed }}
                />
            </View>
        </View>
    );
};

export default memo(IngredientItem);

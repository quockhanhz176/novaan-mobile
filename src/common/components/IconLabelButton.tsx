import { customColors } from "@root/tailwind.config";
import React, { type FC, type ReactElement } from "react";
import {
    TouchableOpacity,
    Text,
    type TextProps,
    type TouchableOpacityProps,
    View,
} from "react-native";
import { type IconProps } from "react-native-vector-icons/Icon";
import IconIonicons from "react-native-vector-icons/Ionicons";

interface IconLabelButtonProps {
    iconPack?: "Ionicons";
    iconProps?: IconProps;
    buttonClassName?: string;
    buttonProps?: TouchableOpacityProps;
    text?: string;
    textClassName?: string;
    textProps?: TextProps;
}

const IconLabelButton: FC<IconLabelButtonProps> = ({
    iconPack = "Ionicons",
    iconProps,
    buttonClassName = "",
    buttonProps,
    text,
    textClassName = "",
    textProps,
}: IconLabelButtonProps) => {
    const iProps: IconProps = {
        name: "heart",
        size: 32,
        color: customColors.heart,
        ...iconProps,
    };

    const renderIcon = (): ReactElement | undefined => {
        if (iconProps?.name == null) {
            return undefined;
        }

        switch (iconPack) {
            case "Ionicons":
                return <IconIonicons {...iProps} />;
        }
    };

    return (
        <TouchableOpacity {...buttonProps}>
            <View
                className={`flex-row space-x-1 items-center ${buttonClassName}`}
            >
                {renderIcon()}
                {text !== null && (
                    <Text
                        className={`text-cgrey-dim font-medium text-sm ${textClassName}`}
                        {...textProps}
                    >
                        {text}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default IconLabelButton;

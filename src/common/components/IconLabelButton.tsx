import { customColors } from "@root/tailwind.config";
import React, { Fragment, type FC, type ReactElement, memo } from "react";
import {
    TouchableOpacity,
    Text,
    type TextProps,
    type TouchableOpacityProps,
    type ViewStyle,
    type StyleProp,
} from "react-native";
import { type IconProps } from "react-native-vector-icons/Icon";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconEvil from "react-native-vector-icons/EvilIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconAnt from "react-native-vector-icons/AntDesign";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import IconFeather from "react-native-vector-icons/Feather";

export interface IconLabelButtonProps {
    iconPack?:
        | "Ionicons"
        | "Community"
        | "Material"
        | "Evil"
        | "Entypo"
        | "Ant"
        | "FA5"
        | "Feather";
    iconProps?: IconProps;
    text?: string;
    textClassName?: string;
    textProps?: TextProps;
    buttonClassName?: string;
    buttonProps?: TouchableOpacityProps;
    style?: StyleProp<ViewStyle>;
}

const IconLabelButton: FC<IconLabelButtonProps> = ({
    iconPack = "Ionicons",
    iconProps,
    text,
    textClassName = "",
    textProps,
    buttonClassName = "",
    buttonProps,
    style,
}: IconLabelButtonProps) => {
    const iProps: IconProps = {
        name: "heart",
        size: 32,
        color: customColors.heart,
        ...iconProps,
    };

    const renderIcon = (): ReactElement | null => {
        if (iconProps?.name == null) {
            return null;
        }

        switch (iconPack) {
            case "Ionicons":
                return <IconIonicons {...iProps} />;
            case "Community":
                return <IconCommunity {...iProps} />;
            case "Material":
                return <IconMaterial {...iProps} />;
            case "Evil":
                return <IconEvil {...iProps} />;
            case "Entypo":
                return <IconEntypo {...iProps} />;
            case "Ant":
                return <IconAnt {...iProps} />;
            case "FA5":
                return <IconFA5 {...iProps} />;
            case "Feather":
                return <IconFeather {...iProps} />;
        }
    };

    return (
        <TouchableOpacity
            {...buttonProps}
            style={style}
            className={`flex-row items-center space-x-1 ${buttonClassName}`}
            activeOpacity={1}
        >
            <>
                {renderIcon()}
                {text !== null && (
                    <Text
                        className={`text-cgrey-dim font-medium text-sm ${textClassName}`}
                        {...textProps}
                    >
                        {text}
                    </Text>
                )}
            </>
        </TouchableOpacity>
    );
};

export default memo(IconLabelButton);

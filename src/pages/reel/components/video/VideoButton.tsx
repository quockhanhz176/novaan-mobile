import React, { type StyleProp, type ViewStyle } from "react-native";
import IconLabelButton, {
    type IconLabelButtonProps,
} from "@/common/components/IconLabelButton";
import { type FC } from "react";

interface VideoButtonProps {
    iconPack?: Exclude<IconLabelButtonProps["iconPack"], undefined>;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    text?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

const VideoButton: FC<VideoButtonProps> = ({
    iconPack = "Ionicons",
    icon = "heart",
    iconSize,
    iconColor,
    text = "Heart",
    style,
    onPress,
}) => (
    <IconLabelButton
        style={style}
        iconPack={iconPack}
        iconProps={{
            name: icon,
            color: iconColor ?? "white",
            ...(iconSize != null ? { size: iconSize } : {}),
        }}
        text={text}
        textClassName="text-white text-xs"
        buttonClassName="flex-col space-x-0 space-y-1"
        buttonProps={{
            onPress
        }}
    />
);

export default VideoButton;

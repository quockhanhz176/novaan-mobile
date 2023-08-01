import { type FC, memo } from "react";
import React, { Animated, Easing, View } from "react-native";
import IconFoundation from "react-native-vector-icons/Foundation";

interface PlayPauseProps {
    showToggle?: boolean;
    icon: "play" | "pause";
}

const PLAY_PAUSE_BACKGROUND_SIZE = 70;

const PlayPause: FC<PlayPauseProps> = ({
    showToggle,
    icon,
}: PlayPauseProps) => {
    const jumpInAnimation = new Animated.Value(0);

    if (showToggle != null) {
        Animated.sequence([
            Animated.timing(jumpInAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
            Animated.timing(jumpInAnimation, {
                toValue: 2,
                duration: 200,
                useNativeDriver: true,
                delay: 500,
                easing: Easing.linear,
            }),
        ]).start();
    } else {
        Animated.timing(jumpInAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    }

    return (
        <View className="absolute top-0 left-0 bottom-0 right-0  justify-center items-center">
            <Animated.View
                className={`bg-[#00000077] rounded-full justify-center items-center${
                    icon === "play" ? " pl-[5]" : ""
                }`}
                style={{
                    height: PLAY_PAUSE_BACKGROUND_SIZE,
                    width: PLAY_PAUSE_BACKGROUND_SIZE,
                    transform: [
                        {
                            scale: jumpInAnimation.interpolate({
                                inputRange: [0, 0.8, 1, 2],
                                outputRange: [0, 1.5, 1, 0],
                            }),
                        },
                    ],
                }}
            >
                <IconFoundation name={icon} color={"white"} size={40} />
            </Animated.View>
        </View>
    );
};

export default memo(PlayPause);

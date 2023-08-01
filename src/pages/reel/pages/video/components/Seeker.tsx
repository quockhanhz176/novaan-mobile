import { customColors } from "@root/tailwind.config";
import { useRef, type FC, memo } from "react";
import React, {
    type GestureResponderEvent,
    View,
    type LayoutChangeEvent,
} from "react-native";
import { Bar } from "react-native-progress";

interface SeekerProps {
    progress?: number;
    onSeek?: (progress: number) => void;
}

const Seeker: FC<SeekerProps> = ({ progress = 0, onSeek }) => {
    const viewWidth = useRef(1);

    const onLayout = (event: LayoutChangeEvent): void => {
        const { width } = event.nativeEvent.layout;
        viewWidth.current = width;
    };

    const onTouchEnd = (e: GestureResponderEvent): void => {
        const progress = e.nativeEvent.locationX / viewWidth.current;
        onSeek?.(progress);
        e.stopPropagation();
    };

    return (
        <View
            onLayout={onLayout}
            className="pt-6"
            onTouchEnd={onTouchEnd}
        >
            <Bar
                unfilledColor={customColors.seeker.background}
                color={customColors.seeker.foreground}
                progress={progress}
                height={4}
                width={null}
                borderWidth={0}
                animated={false}
                borderRadius={0}
            />
        </View>
    );
};

export default memo(Seeker);

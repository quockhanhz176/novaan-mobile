import { times } from "lodash";
import React, { type FC, memo } from "react";
import { View } from "react-native";

interface SegmentsProps {
    count: number;
}

const Segments: FC<SegmentsProps> = ({ count }) => {
    return (
        <View className="h-full w-full flex-row justify-evenly">
            {times(count - 1, () => (
                <View className="bg-white w-[2] h-full" />
            ))}
        </View>
    );
};

export default memo(Segments);

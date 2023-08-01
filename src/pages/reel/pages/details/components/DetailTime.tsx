import { REEL_DETAILS_HOUR, REEL_DETAILS_MINUTE } from "@/common/strings";
import type RecipeTime from "@/pages/create-post/create-recipe/types/RecipeTime";
import { type FC } from "react";
import React, {
    View,
    Text,
    type ViewStyle,
    type StyleProp,
} from "react-native";

interface DetailTimeProps {
    title: string;
    time: RecipeTime;
    style?: StyleProp<ViewStyle>;
}

const DetailTime: FC<DetailTimeProps> = ({ title, time, style }) => {
    let timeText = "";
    if (time.hour > 0) {
        timeText += `${time.hour} ${REEL_DETAILS_HOUR}`;

        if (time.minute > 0) {
            timeText += ` ${time.minute} ${REEL_DETAILS_MINUTE}`;
        }
    } else {
        timeText = `${time.minute} ${REEL_DETAILS_MINUTE}`;
    }

    return (
        <View className="items-center space-y-3" style={style}>
            <Text className="text-base font-normal">{title}</Text>
            <Text className="text-lg font-semibold text-cprimary-300">
                {timeText}
            </Text>
        </View>
    );
};

export default DetailTime;

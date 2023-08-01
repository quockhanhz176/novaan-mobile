import { customColors } from "@root/tailwind.config";
import React, { type ReactElement } from "react";
import { View, Text } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";

interface EmptySavedPostProps {
    label: string;
    isShown: boolean;
}

const EmptySavedPost = ({
    label,
    isShown,
}: EmptySavedPostProps): ReactElement<EmptySavedPostProps> => {
    if (!isShown) {
        return <View></View>;
    }

    return (
        <View className="flex-1 items-center justify-center">
            <IonIcon
                name="ios-sad-outline"
                size={36}
                color={customColors.cprimary["300"]}
            />
            <Text className="mt-2 text-cprimary-300">{label}</Text>
        </View>
    );
};

export default EmptySavedPost;

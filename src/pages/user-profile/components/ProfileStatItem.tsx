import React, { type ReactElement } from "react";
import { View, Text } from "react-native";

interface ProfileStatItemProps {
    label: string;
    value: string | number;
}

const ProfileStatItem = (
    props: ProfileStatItemProps
): ReactElement<ProfileStatItemProps> => {
    return (
        <View className="flex-1 items-center">
            <Text numberOfLines={1}>{props.label}</Text>
            <Text className="text-xl font-semibold text-cprimary-300">
                {props.value}
            </Text>
        </View>
    );
};

export default ProfileStatItem;

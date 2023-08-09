import React, { memo, type ReactElement } from "react";
import { View, Text } from "react-native";

interface ProfileStatItemProps {
    label: string;
    value: string | number;
}

const ProfileStatItem = (
    props: ProfileStatItemProps
): ReactElement<ProfileStatItemProps> => {
    return (
        <View className="items-center">
            <Text numberOfLines={1}>{props.label}</Text>
            <Text className="text-xl font-semibold text-cprimary-300">
                {props.value}
            </Text>
        </View>
    );
};

export default memo(ProfileStatItem);

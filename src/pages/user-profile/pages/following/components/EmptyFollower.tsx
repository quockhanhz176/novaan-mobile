import React, { type ReactElement } from "react";
import { PROFILE_EMPTY_FOLLOWER } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { View, Text } from "react-native";
import MaterialCIcon from "react-native-vector-icons/MaterialCommunityIcons";

const EmptyFollower = (): ReactElement => {
    return (
        <View className="flex-1 items-center justify-center">
            <MaterialCIcon
                name="account-multiple-outline"
                size={36}
                color={customColors.cprimary["300"]}
            />
            <Text className="mt-2 text-cprimary-300">
                {PROFILE_EMPTY_FOLLOWER}
            </Text>
        </View>
    );
};

export default EmptyFollower;

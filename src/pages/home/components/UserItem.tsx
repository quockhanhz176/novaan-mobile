/* eslint-disable @typescript-eslint/no-unused-vars */
import ResourceImage from "@/common/components/ResourceImage";
import React, { memo, type FC, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import IconFeather from "react-native-vector-icons/Feather";
import homeServices from "../services/homeServices";
import type RecommendationUserResponse from "@/api/recommendation/types/RecommendationUserResponse";

interface UserItemProps {
    user: RecommendationUserResponse;
    onPress: (userId: string) => void;
}

const UserItem: FC<UserItemProps> = ({ user, onPress }) => {
    const onItemPress = useCallback(() => {
        onPress(user.userId);
    }, []);

    return (
        <View className="items-center w-[110]" onTouchEnd={onItemPress}>
            <View className="w-[110] h-[110] rounded-full items-center justify-center bg-yellow-200 overflow-hidden mb-3">
                <FastImage
                    source={{
                        uri: user.avatar,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            <Text
                className="text-center text-base font-medium"
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {user.userName}
            </Text>
        </View>
    );
};

export default memo(UserItem);

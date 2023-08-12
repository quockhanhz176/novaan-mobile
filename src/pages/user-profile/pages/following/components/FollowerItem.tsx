import React, { type ReactElement } from "react";
import { type MinimalUserInfo } from "@/api/profile/types";
import { Avatar } from "react-native-paper";
import { View, Text, TouchableOpacity } from "react-native";
import { FOLLOWING_ITEM_HEIGHT } from "@/common/constants";

interface FollowerItemProps {
    followInfo: MinimalUserInfo;
    onItemPress: (item: MinimalUserInfo) => void;
}

const FollowerItem = ({
    followInfo,
    onItemPress,
}: FollowerItemProps): ReactElement<FollowerItemProps> => {
    const handleItemPress = (): void => {
        onItemPress(followInfo);
    };

    return (
        <TouchableOpacity
            className="flex-row mx-4 my-2 items-center"
            style={{
                height: FOLLOWING_ITEM_HEIGHT,
                minHeight: FOLLOWING_ITEM_HEIGHT,
            }}
            onPress={handleItemPress}
            activeOpacity={0.6}
        >
            <View>
                {followInfo.avatar === "" ? (
                    <Avatar.Icon size={48} icon="account-circle" />
                ) : (
                    <Avatar.Image
                        size={48}
                        source={{ uri: followInfo.avatar }}
                    />
                )}
            </View>
            <View className="flex-1 ml-2 ">
                <Text numberOfLines={1}>{followInfo.username}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default FollowerItem;

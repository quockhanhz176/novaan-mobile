import IconLabelButton from "@/common/components/IconLabelButton";
import {
    USER_SEARCH_FOLLOWER_COUNT_LABEL,
    USER_SEARCH_FOLLOW_BUTTON_FOLLOW,
    USER_SEARCH_FOLLOW_BUTTON_FOLLOWED,
    USER_SEARCH_POST_COUNT_LABEL,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import React, { type FC, memo, useState, useCallback } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import type UserSearchResult from "../../types/UserSearchResult";
import searchServices from "../../services/searchServices";
import { debounce } from "lodash";
import FastImage from "react-native-fast-image";

interface UserSearchResultProps {
    user: UserSearchResult;
    onFollowChange?: (userId: string, newValue: boolean) => void;
    onPress?: (userId: string) => void;
}

const UserSearchResultItem: FC<UserSearchResultProps> = ({
    user,
    onFollowChange,
    onPress,
}) => {
    const [followInfo, setFollowInfo] = useState({
        following: user.followed,
        followerCount: user.followerCount,
    });

    const changeFollowApi = useCallback(
        debounce((value: boolean) => {
            void searchServices.setFollow(user.id, value);
        }, 500),
        [user.id]
    );

    const flipFollow = (): void => {
        const newFollow = !followInfo.following;
        const newFollowCount = followInfo.followerCount + (newFollow ? 1 : -1);

        changeFollowApi(newFollow);
        setFollowInfo({ following: newFollow, followerCount: newFollowCount });
        onFollowChange?.(user.id, newFollow);
    };

    const onItemPress = useCallback(() => {
        onPress?.(user.id);
    }, []);

    return (
        <TouchableHighlight
            onPress={onItemPress}
            underlayColor={customColors.ctertiary}
        >
            <View className="flex-row justify-between p-4 border-b border-cgrey-platinum">
                <View className="flex-row space-x-4">
                    <View>
                        <View className="bg-xanthous w-[40] h-[40] rounded-full items-center justify-center overflow-hidden">
                            {user.avatar == null || user.avatar === "" ? (
                                <IconFeather name="user" size={30} />
                            ) : (
                                <FastImage
                                    source={{ uri: user.avatar }}
                                    className="h-full w-full"
                                />
                            )}
                        </View>
                    </View>
                    <View>
                        <Text className="font-medium text-base">
                            {user.username}
                        </Text>
                        <View className="flex-row space-x-2 items-center">
                            <IconFeather
                                name="user"
                                color={customColors.cgrey.dim}
                            />
                            <Text className="text-xs text-cgrey-dim">
                                {followInfo.followerCount}{" "}
                                {USER_SEARCH_FOLLOWER_COUNT_LABEL}
                            </Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <IconCommunity
                                name="silverware-fork-knife"
                                color={customColors.cgrey.dim}
                            />
                            <Text className="text-xs text-cgrey-dim">
                                {user.recipeCount}{" "}
                                {USER_SEARCH_POST_COUNT_LABEL}
                            </Text>
                        </View>
                    </View>
                </View>
                <View>
                    <IconLabelButton
                        buttonClassName={
                            "space-x-0 p-1 px-3 rounded-md" +
                            (followInfo.following
                                ? " bg-cgrey-whitesmoke"
                                : " bg-cprimary-200")
                        }
                        buttonProps={{
                            onPress: flipFollow,
                        }}
                        text={
                            followInfo.following
                                ? USER_SEARCH_FOLLOW_BUTTON_FOLLOWED
                                : USER_SEARCH_FOLLOW_BUTTON_FOLLOW
                        }
                        textClassName={followInfo.following ? "" : "text-white"}
                    />
                </View>
            </View>
        </TouchableHighlight>
    );
};

export default memo(UserSearchResultItem);

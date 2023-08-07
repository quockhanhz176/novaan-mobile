import React, {
    useEffect,
    type ReactElement,
    useState,
    useMemo,
    useCallback,
} from "react";
import { type MinimalUserInfo } from "@/api/profile/types";
import { Avatar } from "react-native-paper";
import {
    View,
    Text,
    Pressable,
    type GestureResponderEvent,
} from "react-native";
import { useFetchResourceUrl } from "@/api/utils/resourceHooks";
import { customColors } from "@root/tailwind.config";
import followApi from "@/api/follow/FollowApi";
import { debounce } from "lodash";

interface FollowingItemProps {
    followInfo: MinimalUserInfo;
    onItemPress: (item: MinimalUserInfo) => void;
    setFollowingCount?: (setter: (value: number) => number) => void;
}

const FollowingItem = ({
    followInfo,
    onItemPress,
    setFollowingCount,
}: FollowingItemProps): ReactElement<FollowingItemProps> => {
    // TODO: Implement follow/unfollow later
    const [followingPress, setFollowingPress] = useState(false);
    const [isFollowing, setIsFollowing] = useState(true);

    const { resourceUrl, fetchUrl } = useFetchResourceUrl();
    useEffect(() => {
        void fetchUrl(followInfo.avatar);
    }, [followInfo.avatar]);

    const followingBtnColor = useMemo(() => {
        if (isFollowing) {
            return followingPress
                ? customColors.cprimary["400"]
                : customColors.cprimary["300"];
        }

        return followingPress
            ? customColors.gray["300"]
            : customColors.gray["200"];
    }, [followingPress]);

    const followingBtnLabel = useMemo(
        () => (isFollowing ? "Đang theo dõi" : "Theo dõi"),
        [isFollowing]
    );

    const followingBtnTextColor = useMemo(
        () => (isFollowing ? customColors.white : customColors.black),
        [isFollowing]
    );

    const handleFollowingPressIn = (event: GestureResponderEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        setFollowingPress(true);
    };

    const changeFollowApi = useCallback(
        debounce((value: boolean) => {
            void followApi.setFollow(followInfo.userId, value);
        }, 1000),
        [followInfo.userId]
    );

    const handleFollowingPress = (): void => {
        setFollowingPress(false);
        setIsFollowing(!isFollowing);
        changeFollowApi(!isFollowing);
        setFollowingCount?.((value) => value + (!isFollowing ? 1 : -1));
    };

    const handleItemPress = (): void => {
        onItemPress(followInfo);
    };

    return (
        <Pressable
            className="flex-1 flex-row mx-4 my-2 items-center"
            onPress={handleItemPress}
        >
            <View>
                {resourceUrl === "" ? (
                    <Avatar.Icon size={48} icon="account-circle" />
                ) : (
                    <Avatar.Image size={48} source={{ uri: resourceUrl }} />
                )}
            </View>
            <View className="flex-1 ml-2 ">
                <Text numberOfLines={1}>{followInfo.username}</Text>
            </View>
            <View>
                <Pressable
                    className="px-4 py-2 rounded-lg"
                    style={{ backgroundColor: followingBtnColor }}
                    onPressIn={handleFollowingPressIn}
                    onPress={handleFollowingPress}
                >
                    <Text style={{ color: followingBtnTextColor }}>
                        {followingBtnLabel}
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
};

export default FollowingItem;

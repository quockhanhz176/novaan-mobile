import React, {
    type ReactElement,
    useEffect,
    useState,
    createContext,
    useMemo,
    memo,
} from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import CreatedPosts from "./pages/created-post/CreatedPosts";
import SavedPosts from "./pages/saved-post/SavedPosts";
import { type BottomTabNavProp } from "@/types/navigation";
import { useProfileInfo } from "@/api/profile/ProfileApi";
import OverlayLoading from "@/common/components/OverlayLoading";
import {
    PROFILE_CONTENT_COUNT_TITLE,
    PROFILE_FOLLOWER_COUNT_TITLE,
    PROFILE_FOLLOWING_COUNT_TITLE,
    PROFILE_PAGE_LABEL,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { Avatar } from "react-native-paper";
import Toast from "react-native-toast-message";
import ProfileStatItem from "./components/ProfileStatItem";
import { type ProfileInfo } from "@/api/profile/types";
import Following from "./pages/following/Following";
import ProfileTabIcon from "./components/ProfileTabIcon";
import MaterialCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import useBooleanHook from "@/common/components/BooleanHook";
import CustomModal from "@/common/components/CustomModal";
import SettingMenu from "./components/SettingMenu";
import Follower from "./pages/following/Follower";

interface UserProfileProps {
    navigation?: BottomTabNavProp;
    userId?: string;
    showBackButton?: boolean;
    onClose?: () => void;
    showStatus?: boolean;
}

interface UserProfileContextProps {
    userInfo?: ProfileInfo;
}

export const UserProfileContext = createContext<UserProfileContextProps>({
    userInfo: undefined,
});

const userProfileRoute = [
    { key: "created" },
    { key: "saved" },
    { key: "following" },
    { key: "follower" },
];

const peopleProfileRoute = [{ key: "created" }];

const UserProfile = ({
    navigation,
    userId,
    showBackButton = true,
    onClose,
    showStatus = true,
}: UserProfileProps): ReactElement<UserProfileProps> => {
    const isUserProfile = useMemo(() => userId == null, [userId]);

    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState<Array<{ key: string }>>([]);

    const [profileSettingOpen, hideProfileSetting, showProfileSetting] =
        useBooleanHook();

    useEffect(() => {
        if (isUserProfile) {
            setRoutes(userProfileRoute);
        } else {
            setRoutes(peopleProfileRoute);
        }
    }, [isUserProfile]);

    const { profileInfo, fetchPersonalProfile, fetchUserProfile } =
        useProfileInfo();

    const [followingCount, setFollowingCount] = useState<number>(0);

    useEffect(() => {
        void handleFetchProfile();
    }, [userId]);

    useEffect(() => {
        if (profileInfo == null) {
            return;
        }

        if (profileInfo.followingCount === followingCount) {
            return;
        }

        setFollowingCount(profileInfo.followingCount);
    }, [profileInfo]);

    const renderScene = useMemo(() => {
        if (isUserProfile) {
            return SceneMap({
                created: CreatedPosts,
                saved: SavedPosts,
                following: () => (
                    <Following setFollowingCount={setFollowingCount} />
                ),
                follower: () => <Follower />,
            });
        }

        return SceneMap({
            created: () => <CreatedPosts showStatus={false} />,
        });
    }, [isUserProfile]);

    const handleFetchProfile = async (): Promise<void> => {
        try {
            let fetched = false;
            if (userId == null) {
                fetched = await fetchPersonalProfile();
            } else {
                fetched = await fetchUserProfile(userId);
            }
            if (!fetched) {
                throw new Error();
            }
        } catch {
            if (navigation == null) {
                onClose?.();
            }
            Toast.show({
                type: "error",
                text1: "Failed to fetch user profile",
            });
        }
    };

    const getTabBarIcon = (route: { key: string }): string => {
        switch (route.key) {
            case "created":
                return "grid";
            case "saved":
                return "bookmark-outline";
            case "following":
                return "account-eye";
            case "follower":
                return "account-heart";
            default:
                return "grid";
        }
    };

    const userProfileContextValue = useMemo(
        () => ({ userInfo: profileInfo }),
        [profileInfo]
    );

    if (profileInfo == null) {
        return <OverlayLoading />;
    }

    const { username, followersCount, postCount, avatar } = profileInfo;

    return (
        <View className="flex-1 bg-white">
            <View className="items-center mx-6 mt-4 flex-row">
                <View className="items-start">
                    {!isUserProfile && showBackButton && (
                        <Pressable
                            onPress={onClose}
                            className="pr-2 py-2 rounded-lg"
                        >
                            <MaterialIcon name="arrow-back" size={24} />
                        </Pressable>
                    )}
                </View>
                <View className="flex-row justify-start">
                    <Text className="text-lg font-semibold">
                        {isUserProfile ? PROFILE_PAGE_LABEL : username}
                    </Text>
                </View>
                <View className="flex-1 items-end">
                    {isUserProfile && (
                        <>
                            <TouchableOpacity
                                onPress={showProfileSetting}
                                className="rounded-lg"
                                hitSlop={5}
                                delayPressIn={0}
                            >
                                <MaterialCIcon name="hamburger" size={24} />
                            </TouchableOpacity>
                            <CustomModal
                                visible={profileSettingOpen}
                                onDismiss={hideProfileSetting}
                            >
                                <SettingMenu onDimiss={hideProfileSetting} />
                            </CustomModal>
                        </>
                    )}
                </View>
            </View>
            <View className="mx-6 mt-6 flex-row items-start justify-start">
                <Avatar.Image
                    size={64}
                    style={{
                        backgroundColor: customColors.cprimary["300"],
                    }}
                    source={{ uri: avatar }}
                />
                <View className="flex-1 items-start mx-4">
                    <Text className="text-lg font-semibold">{username}</Text>
                </View>
            </View>
            <View className="mx-6 mt-6 flex-row justify-between">
                {/* TODO: Add approved content count here (postCount) */}
                <ProfileStatItem
                    label={PROFILE_CONTENT_COUNT_TITLE}
                    value={postCount ?? 0}
                />
                <ProfileStatItem
                    label={PROFILE_FOLLOWER_COUNT_TITLE}
                    value={followersCount ?? 0}
                />
                <ProfileStatItem
                    label={PROFILE_FOLLOWING_COUNT_TITLE}
                    value={followingCount ?? 0}
                />
            </View>
            <UserProfileContext.Provider value={userProfileContextValue}>
                <TabView
                    className="flex-1 mt-4"
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    lazy={true}
                    renderLazyPlaceholder={() => <OverlayLoading />}
                    renderTabBar={(tabBarProp) => (
                        <TabBar
                            {...tabBarProp}
                            style={{ elevation: 0 }}
                            indicatorContainerStyle={{
                                backgroundColor: customColors.white,
                            }}
                            indicatorStyle={{
                                backgroundColor: customColors.cprimary["300"],
                            }}
                            renderLabel={(iconProp) => (
                                <ProfileTabIcon
                                    {...iconProp}
                                    icon={getTabBarIcon(iconProp.route)}
                                />
                            )}
                        />
                    )}
                />
            </UserProfileContext.Provider>
            {profileInfo == null && <OverlayLoading />}
        </View>
    );
};

export default memo(UserProfile);

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
    PROFILE_EMPTY_BIO,
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
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import useBooleanHook from "@/common/components/BooleanHook";
import CustomModal from "@/common/components/CustomModal";
import SettingMenu from "./pages/created-post/components/SettingMenu";

interface UserProfileProps {
    navigation?: BottomTabNavProp;
    userId?: string;
    showBackButton?: boolean;
    onClose?: () => void;
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
];

const peopleProfileRoute = [{ key: "created" }];

const UserProfile = ({
    navigation,
    userId,
    showBackButton = true,
    onClose,
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

    useEffect(() => {
        void handleFetchProfile();
    }, [userId]);

    const renderScene = useMemo(() => {
        if (isUserProfile) {
            return SceneMap({
                created: CreatedPosts,
                saved: SavedPosts,
                following: Following,
            });
        }

        return SceneMap({
            created: CreatedPosts,
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
            } else {
                navigation.navigate("Home");
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
                return "account-group-outline";
            default:
                return "grid";
        }
    };

    if (profileInfo == null) {
        return <OverlayLoading />;
    }

    const { username, followersCount, followingCount } = profileInfo;

    return (
        <View className="flex-1 bg-white">
            <View className="items-center mx-6 mt-4 flex-row">
                <View className="items-start">
                    {!isUserProfile && showBackButton && (
                        <Pressable
                            onPress={onClose}
                            className="pr-2 py-2 rounded-lg"
                        >
                            <MaterialCIcon name="arrow-back" size={24} />
                        </Pressable>
                    )}
                </View>
                <View className="flex-row justify-start">
                    <Text className="text-cprimary-300 text-lg font-semibold">
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
                                <MaterialCIcon
                                    name="hamburger"
                                    size={24}
                                    color={customColors.cprimary["300"]}
                                />
                            </TouchableOpacity>
                            <CustomModal
                                visible={profileSettingOpen}
                                onDismiss={hideProfileSetting}
                            >
                                <SettingMenu />
                            </CustomModal>
                        </>
                    )}
                </View>
            </View>
            <View className="mx-6 mt-6 flex-row items-center justify-between">
                <Avatar.Text
                    size={64}
                    style={{
                        backgroundColor: customColors.cprimary["300"],
                    }}
                    label="XD"
                />
                <View className="flex-1 mx-3">
                    <Text className="text-lg font-semibold text-cprimary-300">
                        {username}
                    </Text>
                    <Text className="text-gray-400 italic">
                        {PROFILE_EMPTY_BIO}
                    </Text>
                </View>
            </View>
            <View className="mx-6 mt-4 flex-row justify-between">
                {/* TODO: Add approved content count here (postCount) */}
                <ProfileStatItem
                    label={PROFILE_CONTENT_COUNT_TITLE}
                    value={0}
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
            <UserProfileContext.Provider value={{ userInfo: profileInfo }}>
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

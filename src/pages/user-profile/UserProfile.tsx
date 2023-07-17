import React, {
    type ReactElement,
    useEffect,
    useState,
    createContext,
    useMemo,
} from "react";
import { Pressable, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CreatedPosts from "./pages/created-post/CreatedPosts";
import SavedPosts from "./pages/saved-post/SavedPosts";
import {
    type BottomTabNavProp,
    type UserProfileTabParamList,
} from "@/types/navigation";
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
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const Tab = createMaterialTopTabNavigator<UserProfileTabParamList>();

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

const UserProfile = (
    props: UserProfileProps
): ReactElement<UserProfileProps> => {
    const { navigation, userId, showBackButton = true, onClose } = props;

    const isUserProfile = useMemo(() => userId == null, [userId]);

    const [loading, setLoading] = useState(true);

    const { profileInfo, fetchPersonalProfile, fetchUserProfile } =
        useProfileInfo();

    useEffect(() => {
        void handleFetchProfile();
    }, [userId]);

    const handleFetchProfile = async (): Promise<void> => {
        setLoading(true);
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
        } finally {
            setLoading(false);
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
                            <MaterialIcon name="arrow-back" size={24} />
                        </Pressable>
                    )}
                </View>
                <View className="items-center">
                    <Text className="text-cprimary-300 text-lg font-semibold">
                        {isUserProfile ? PROFILE_PAGE_LABEL : username}
                    </Text>
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
                <Tab.Navigator
                    className="flex-1 mt-4"
                    screenOptions={{
                        tabBarItemStyle: {
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: customColors.cprimary["300"],
                        },
                    }}
                >
                    <Tab.Screen
                        name="CreatedPosts"
                        component={CreatedPosts}
                        options={{
                            tabBarLabel: (props) => (
                                <ProfileTabIcon {...props} icon="grid" />
                            ),
                        }}
                    />
                    {isUserProfile && (
                        <Tab.Screen
                            name="SavedPosts"
                            component={SavedPosts}
                            options={{
                                tabBarLabel: (props) => (
                                    <ProfileTabIcon
                                        {...props}
                                        icon="bookmark-outline"
                                    />
                                ),
                            }}
                        />
                    )}
                    {isUserProfile && (
                        <Tab.Screen
                            name="Following"
                            component={Following}
                            options={{
                                tabBarLabel: (props) => (
                                    <ProfileTabIcon
                                        {...props}
                                        icon="account-group-outline"
                                    />
                                ),
                            }}
                        />
                    )}
                </Tab.Navigator>
            </UserProfileContext.Provider>
            {loading && <OverlayLoading />}
        </View>
    );
};

export default UserProfile;

import React, {
    type ReactElement,
    useEffect,
    useState,
    createContext,
} from "react";
import { Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CreatedPosts from "./pages/created-post/CreatedPosts";
import SavedPosts from "./pages/saved-post/SavedPosts";
import {
    type BottomTabParamList,
    type UserProfileTabParamList,
} from "@/types/navigation";
import { useProfileInfo } from "@/api/profile/ProfileApi";
import OverlayLoading from "@/common/components/OverlayLoading";
import {
    PROFILE_CONTENT_COUNT_TITLE,
    PROFILE_FOLLOWER_COUNT_TITLE,
    PROFILE_FOLLOWING_COUNT_TITLE,
    PROFILE_EMPTY_BIO,
} from "@/common/strings";
import { type MaterialBottomTabNavigationProp } from "@react-navigation/material-bottom-tabs";
import { customColors } from "@root/tailwind.config";
import { Avatar } from "react-native-paper";
import Toast from "react-native-toast-message";
import ProfileStatItem from "./components/ProfileStatItem";
import { type ProfileInfo } from "@/api/profile/types";
import Following from "./pages/following/Following";
import ProfileTabIcon from "./components/ProfileTabIcon";

const Tab = createMaterialTopTabNavigator<UserProfileTabParamList>();

interface UserProfileProps {
    navigation: MaterialBottomTabNavigationProp<BottomTabParamList>;
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
    const { navigation } = props;

    const [loading, setLoading] = useState(true);

    const { profileInfo, fetchPersonalProfile } = useProfileInfo();

    useEffect(() => {
        void handleFetchProfile();
    }, []);

    useEffect(() => {
        if (profileInfo == null) {
            return;
        }

        console.log(profileInfo);
    }, [profileInfo]);

    const handleFetchProfile = async (): Promise<void> => {
        setLoading(true);
        try {
            const fetched = await fetchPersonalProfile();
            if (!fetched) {
                throw new Error();
            }
        } catch {
            navigation.navigate("Home");
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
            <View className="items-center justify-center mt-4">
                <Text className="text-cprimary-300 text-xl font-semibold">
                    {username}
                </Text>
            </View>
            <View className="mx-6 mt-4 flex-row items-center justify-center">
                <Avatar.Text
                    size={96}
                    style={{
                        backgroundColor: customColors.cprimary["300"],
                    }}
                    label="XD"
                    className="mr-2"
                />
            </View>
            <View className="mx-6 mt-4 flex-row">
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
            <View className="mx-6 my-4">
                <Text className="text-xl text-cprimary-300">{username}</Text>
                {/* TODO: Add user brief description here when it is ready */}
                <Text className="text-gray-600 italic mt-2">
                    {PROFILE_EMPTY_BIO}
                </Text>
            </View>
            <UserProfileContext.Provider value={{ userInfo: profileInfo }}>
                <Tab.Navigator
                    className="flex-1"
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
                </Tab.Navigator>
            </UserProfileContext.Provider>
            {loading && <OverlayLoading />}
        </View>
    );
};

export default UserProfile;

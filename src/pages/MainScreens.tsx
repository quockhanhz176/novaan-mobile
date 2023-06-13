import React, { type FC } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "react-native-paper";

import Home from "./home/Home";
import Search from "./search/Search";
import Reel from "./reel/Reel";
import UserProfile from "./user-profile/UserProfile";
import CreatePost from "./create-post/CreatePost";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BottomTabParamList = {
    Home: undefined;
    Search: undefined;
    Reel: undefined;
    UserProfile: undefined;
    CreatePost: undefined;
};
const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

const MainScreens: FC = () => {
    const theme = useTheme();
    theme.colors.secondaryContainer = "transparent";
    return (
        <View className="flex-1">
            <BottomTab.Navigator
                activeColor="#E94F37"
                barStyle={{
                    backgroundColor: "#fcfcfc",
                    borderTopWidth: 1,
                    borderColor: "#f0f0f0",
                    borderRadius: 20,
                }}
            >
                <BottomTab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel: "Trang chủ",
                        tabBarIcon: ({ color }) => (
                            <Icon name="home" size={24} color={color} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Search"
                    component={Search}
                    options={{
                        tabBarLabel: "Tìm kiếm",
                        tabBarIcon: ({ color }) => (
                            <Icon name="search" size={24} color={color} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Reel"
                    component={Reel}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Icon name="film" size={24} color={color} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="CreatePost"
                    component={CreatePost}
                    options={{
                        tabBarLabel: "Đăng bài",
                        tabBarIcon: ({ color }) => (
                            <Icon name="plus" size={24} color={color} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="UserProfile"
                    component={UserProfile}
                    options={{
                        tabBarLabel: "Cá nhân",
                        tabBarIcon: ({ color }) => (
                            <Icon name="user" size={24} color={color} />
                        ),
                    }}
                />
            </BottomTab.Navigator>
        </View>
    );
};

export default MainScreens;

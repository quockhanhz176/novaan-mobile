import React, { type ReactElement } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import Home from "./Home";
import Reel from "../reel/Reel";
import Search from "../search/Search";
import CreatePost from "../create-post/CreatePost";
import UserProfile from "../user-profile/UserProfile";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BottomTabParamList = {
    Home: undefined;
    Search: undefined;
    Reel: undefined;
    UserProfile: undefined;
    CreatePost: undefined;
};
const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

const MainScreen = (): ReactElement => {
    return (
        <View className="flex-1">
            <BottomTab.Navigator>
                <BottomTab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Icon name="home" size={24} color={color} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Search"
                    component={Search}
                    options={{
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
                        tabBarLabel: "Create Post",
                        tabBarIcon: ({ color }) => (
                            <Icon name="plus" size={24} color={color} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="UserProfile"
                    component={UserProfile}
                    options={{
                        tabBarLabel: "Profile",
                        tabBarIcon: ({ color }) => (
                            <Icon name="user" size={24} color={color} />
                        ),
                    }}
                />
            </BottomTab.Navigator>
        </View>
    );
};

export default MainScreen;

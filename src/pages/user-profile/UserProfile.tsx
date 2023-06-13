import React from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CreatedPosts from "./CreatedPosts";
import SavedPosts from "./SavedPosts";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type UserProfileTabParamList = {
    SavedPosts: undefined;
    CreatedPosts: undefined;
};

const Tab = createMaterialTopTabNavigator<UserProfileTabParamList>();

const UserProfile: React.FC = () => {
    return (
        <View className="flex">
            <View
                className="basis-2/5"
                style={{ backgroundColor: "#fff" }}
            ></View>
            <Tab.Navigator
                className="basis-3/4"
                screenOptions={{
                    tabBarStyle: { elevation: 1 },
                    tabBarItemStyle: { width: 100 },
                }}
            >
                <Tab.Screen
                    name="SavedPosts"
                    component={SavedPosts}
                    options={{
                        tabBarLabel: "Lưu trữ",
                    }}
                />
                <Tab.Screen
                    name="CreatedPosts"
                    component={CreatedPosts}
                    options={{
                        tabBarLabel: "Bài đăng",
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

export default UserProfile;

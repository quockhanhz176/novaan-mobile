import React, { useState, type FC } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "react-native-paper";

import Home from "./home/Home";
import Search from "./search/Search";
import Reel from "./reel/Reel";
import UserProfile from "./user-profile/UserProfile";
import CreatePostPopup from "./create-post/CreatePostPopup";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type RootStackParamList } from "App";
import { BOTTOM_NAV_HEIGHT } from "@/common/constants";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BottomTabParamList = {
    Home: undefined;
    Search: undefined;
    Reel: undefined;
    UserProfile: undefined;
    CreatePostPopup: undefined;
};
const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

interface MainScreensProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "MainScreens">;
}

const MainScreens: FC<MainScreensProps> = ({
    navigation,
}: MainScreensProps) => {
    const theme = useTheme();
    theme.colors.secondaryContainer = "transparent";
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View className="flex-1">
            <BottomTab.Navigator
                activeColor="#E94F37"
                barStyle={{
                    height: BOTTOM_NAV_HEIGHT,
                    backgroundColor: "#fcfcfc",
                    borderTopWidth: 1,
                    borderColor: "#f0f0f0",
                }}
                initialRouteName="Reel"
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
                    name="CreatePostPopup"
                    component={CreatePostPopup}
                    options={{
                        tabBarLabel: "Đăng bài",
                        tabBarIcon: ({ color }) => (
                            <Icon name="plus" size={24} color={color} />
                        ),
                    }}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            setModalVisible(true);
                        },
                    })}
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
            <CreatePostPopup
                navigation={navigation}
                visible={modalVisible}
                setVisible={setModalVisible}
            />
        </View>
    );
};

export default MainScreens;

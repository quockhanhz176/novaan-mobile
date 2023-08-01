import React, { useState, type FC } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTheme } from "react-native-paper";

import Home from "./home/Home";
import Search from "./search/Search";
import Reel from "./reel/Reel";
import UserProfile from "./user-profile/UserProfile";
import CreatePostPopup from "./create-post/CreatePostPopup";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    type BottomTabParamList,
    type RootStackParamList,
} from "@/types/navigation";
import { BOTTOM_NAV_HEIGHT } from "@/common/constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { customColors } from "@root/tailwind.config";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

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
                screenOptions={{
                    tabBarActiveTintColor: customColors.cprimary["300"],
                    tabBarItemStyle: {
                        marginVertical: 12,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    tabBarStyle: {
                        height: BOTTOM_NAV_HEIGHT,
                    },
                    headerShown: false,
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
                    name="Reel"
                    component={Reel}
                    options={{
                        unmountOnBlur: true,
                        tabBarIcon: ({ color }) => (
                            <Icon name="film" size={24} color={color} />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="CreatePostPopup"
                    component={CreatePostPopup}
                    options={{
                        tabBarLabel: "",
                        tabBarIcon: ({ color }) => (
                            <Icon name="plus" size={24} color={color} />
                        ),
                    }}
                    listeners={() => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            setModalVisible(true);
                        },
                    })}
                />
                <BottomTab.Screen
                    name="Search"
                    component={Search}
                    options={{
                        unmountOnBlur: true,
                        tabBarLabel: "Tìm kiếm",
                        tabBarIcon: ({ color }) => (
                            <Icon name="search" size={24} color={color} />
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

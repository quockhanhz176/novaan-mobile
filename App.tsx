/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import MainScreens from "@/pages/MainScreens";
import CreateTip from "@/pages/create-post/create-tip/CreateTip";
import { PaperProvider, Portal } from "react-native-paper";
import CreateRecipe from "@/pages/create-post/create-recipe/CreateRecipe";
import { toastConfig } from "@/common/configs/toast.config";
import Toast from "react-native-toast-message";
import { type RootStackParamList } from "@/types/navigation";
import { enableScreens } from "react-native-screens";
import { OrientationLock, lockAsync } from "expo-screen-orientation";
import { MenuProvider } from "react-native-popup-menu";

const RootStack = createNativeStackNavigator<RootStackParamList>();

enableScreens();

const DEFAULT_ORIENTATION = OrientationLock.PORTRAIT_UP;

const App = () => {
    const handleLockOrientation = async (): Promise<void> => {
        await lockAsync(DEFAULT_ORIENTATION);
    };

    useEffect(() => {
        void handleLockOrientation();
    }, []);

    return (
        <MenuProvider>
            <PaperProvider
                settings={{
                    rippleEffectEnabled: false,
                }}
            >
                <Portal>
                    <View className="flex-1">
                        <NavigationContainer>
                            <RootStack.Navigator
                                screenOptions={{
                                    headerShown: false,
                                    contentStyle: {
                                        backgroundColor: "#FFFFFF",
                                    },
                                }}
                                initialRouteName="SignIn"
                            >
                                <RootStack.Screen
                                    name="SignIn"
                                    component={SignIn}
                                    options={{ title: "Sign In" }}
                                />
                                <RootStack.Screen
                                    name="SignUp"
                                    component={SignUp}
                                    options={{ title: "Sign Up" }}
                                />
                                <RootStack.Screen
                                    name="MainScreens"
                                    component={MainScreens}
                                    options={{ title: "Main Screens" }}
                                />
                                <RootStack.Screen
                                    name="CreateTip"
                                    component={CreateTip}
                                    options={{
                                        animation: "slide_from_bottom",
                                        animationDuration: 200,
                                    }}
                                />
                                <RootStack.Screen
                                    name="CreateRecipe"
                                    component={CreateRecipe}
                                    options={{
                                        animation: "slide_from_bottom",
                                        animationDuration: 200,
                                    }}
                                />
                            </RootStack.Navigator>
                        </NavigationContainer>
                    </View>
                </Portal>
            </PaperProvider>
            <Toast config={toastConfig} />
        </MenuProvider>
    );
};

export default App;

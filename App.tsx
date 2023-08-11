import React, { type FC, useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
import Greet from "@/pages/user-profile/pages/preferences/Greet";
import SetPreferences from "@/pages/user-profile/pages/preferences/SetPreferences";
import SplashScreen from "@/pages/auth/SplashScreen";
import SignIn from "@/pages/auth/SignIn";

const RootStack = createNativeStackNavigator<RootStackParamList>();

enableScreens();

const DEFAULT_ORIENTATION = OrientationLock.PORTRAIT_UP;

const App: FC = () => {
    const handleLockOrientation = async (): Promise<void> => {
        await lockAsync(DEFAULT_ORIENTATION);
    };

    useEffect(() => {
        void handleLockOrientation();
    }, []);

    return (
        <>
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
                                initialRouteName="SplashScreen"
                            >
                                <RootStack.Screen
                                    name="SplashScreen"
                                    component={SplashScreen}
                                    options={{ title: "Splash Screen" }}
                                />

                                <RootStack.Group>
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
                                </RootStack.Group>

                                <RootStack.Screen
                                    name="MainScreens"
                                    component={MainScreens}
                                    options={{ title: "Main Screens" }}
                                />

                                <RootStack.Group
                                    screenOptions={{
                                        animation: "slide_from_bottom",
                                        animationDuration: 200,
                                    }}
                                >
                                    <RootStack.Screen
                                        name="CreateTip"
                                        component={CreateTip}
                                    />
                                    <RootStack.Screen
                                        name="CreateRecipe"
                                        component={CreateRecipe}
                                    />
                                </RootStack.Group>

                                <RootStack.Group>
                                    <RootStack.Screen
                                        name="Greet"
                                        component={Greet}
                                    />
                                    <RootStack.Screen
                                        name="SetPreferences"
                                        component={SetPreferences}
                                        options={{
                                            title: "Lựa chọn sở thích",
                                            animation: "slide_from_right",
                                            headerShown: true,
                                        }}
                                    />
                                </RootStack.Group>
                            </RootStack.Navigator>
                        </NavigationContainer>
                    </View>
                </Portal>
            </PaperProvider>
            <Toast config={toastConfig} />
        </>
    );
};

export default App;

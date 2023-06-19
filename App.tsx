/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import { Button, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import MainScreens from "@/pages/MainScreens";

import { customColors } from "@root/tailwind.config";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    MainScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <View className="flex-1">
            <NavigationContainer>
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: "#FFFFFF",
                        },
                    }}
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
                        name="MainScreen"
                        component={MainScreens}
                        options={{ title: "Main Screen" }}
                    />
                </RootStack.Navigator>
            </NavigationContainer>
        </View>
    );
};

export default App;

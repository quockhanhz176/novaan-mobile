import {
    GREET_GREET,
    GREET_GREET_APP,
    GREET_NEXT_BTN_TITLE,
    GREET_SKIP_BTN_TITLE,
    SET_PREFERENCE_INVITE,
} from "@/common/strings";
import { type RootStackParamList } from "@/types/navigation";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { customColors } from "@root/tailwind.config";
import React, { useEffect, type ReactElement } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import IconFA5 from "react-native-vector-icons/MaterialCommunityIcons";

interface GreetProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "Greet">;
}

const Greet = ({ navigation }: GreetProps): ReactElement<GreetProps> => {
    useEffect(() => {
        // Clear navigation stack to avoid user pressing back to sign in
        navigation.addListener("beforeRemove", (e) => {
            e.preventDefault();
        });
    }, [navigation]);

    const redirectToMainScreeen = (): void => {
        // Replace to avoid user navigate back
        navigation.push("MainScreens");
    };

    const redirectToSetPreference = (): void => {
        navigation.push("SetPreferences");
    };

    const handleUserSkip = async (): Promise<void> => {
        // Send request to set empty (default preference for user)

        // Redirect to Main Screen
        redirectToMainScreeen();
    };

    return (
        <View className="flex-1">
            <View className="flex-1 mx-8 justify-center">
                <View className="justify-center items-center">
                    <IconFA5
                        name="hamburger-plus"
                        color={customColors.cprimary["300"]}
                        size={150}
                    />
                    <View className="mt-4">
                        <Text className="text-2xl text-center">
                            {GREET_GREET}
                        </Text>
                        <Text className="text-2xl text-center">
                            {GREET_GREET_APP}
                        </Text>
                        <Text className="text-base text-justify mt-4">
                            {SET_PREFERENCE_INVITE}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="mb-4 mx-4 flex-row space-x-4">
                <TouchableOpacity
                    className="flex-1 px-4 py-2 rounded-lg bg-white items-center border"
                    activeOpacity={0.3}
                    onPress={handleUserSkip}
                >
                    <Text className="text-base text-gray-800">
                        {GREET_SKIP_BTN_TITLE}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 px-4 py-2 rounded-lg bg-cprimary-300 items-center"
                    activeOpacity={0.3}
                    onPress={redirectToSetPreference}
                >
                    <Text className="text-base text-white">
                        {GREET_NEXT_BTN_TITLE}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Greet;

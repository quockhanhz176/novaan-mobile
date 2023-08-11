import { type TokenPayload } from "@/api/baseApiHook";
import { getPayloadFromToken } from "@/api/common/utils/TokenUtils";
import { useUserPreferences } from "@/api/profile/ProfileApi";
import { getData } from "@/common/AsyncStorageService";
import { SPLASH_SCREEN_APP_NAME } from "@/common/strings";
import { type RootStackParamList } from "@/types/navigation";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, type FC } from "react";
import React, { View, Text } from "react-native";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";

export const handleSignInSuccessRedirect = async (
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        keyof RootStackParamList
    >,
    haveUserSetPreference: () => Promise<boolean>
): Promise<void> => {
    try {
        // Load data from cache (if possbile)
        // If not, load data from API
        let notFirstTime = await getData("haveUserSetPreference");
        if (notFirstTime == null) {
            notFirstTime = await haveUserSetPreference();
        }

        if (!notFirstTime) {
            navigation.navigate("Greet");
            return;
        }

        navigation.navigate("MainScreens");
    } catch (e) {
        navigation.navigate("MainScreens");
    }
};

interface SplashScreenProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SplashScreen">;
}

const SplashScreen: FC<SplashScreenProps> = ({ navigation }) => {
    const { haveUserSetPreference } = useUserPreferences();

    useEffect(() => {
        void handlePersistentSignIn();
    }, []);

    const handlePersistentSignIn = async (): Promise<void> => {
        // Check if there is a token exist
        try {
            const currentUserToken = await getPayloadFromToken<TokenPayload>();
            if (currentUserToken.exp == null) {
                navigation.navigate("SignIn");
                return;
            }

            void handleSignInSuccessRedirect(navigation, haveUserSetPreference);
        } catch (e) {
            // Continue with normal sign in
            navigation.navigate("SignIn");
        }
    };

    return (
        <View className="justify-center items-center flex-1">
            <View className="pr-[4]">
                <IconCommunity name="silverware-fork-knife" size={90} />
            </View>
            <Text className="text-5xl font-bold mt-8">
                {SPLASH_SCREEN_APP_NAME}
            </Text>
        </View>
    );
};

export default SplashScreen;

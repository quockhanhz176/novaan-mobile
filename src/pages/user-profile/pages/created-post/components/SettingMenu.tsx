import { invalidateData } from "@/common/AsyncStorageService";
import IconLabelButton from "@/common/components/IconLabelButton";
import { deleteKeychainValue } from "@/common/keychainService";
import { PROFILE_LOGOUT, PROFILE_UPDATE_PREF } from "@/common/strings";
import { type RootStackParamList } from "@/types/navigation";
import { KEYCHAIN_ID } from "@env";
import { useNavigation } from "@react-navigation/native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { customColors } from "@root/tailwind.config";
import React, { type ReactElement } from "react";
import { View } from "react-native";

const SettingMenu = (): ReactElement => {
    const rootNavigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleOpenSetPreferences = (): void => {
        // Go to set preferences page
        rootNavigation.push("SetPreferences", { firstTime: false });
    };

    const handleLogout = async (): Promise<void> => {
        // Clear current user cache data
        await invalidateData("reelsData");
        await invalidateData("userPreferenceData");
        await invalidateData("haveUserSetPreference");

        // Clear user token
        await deleteKeychainValue(KEYCHAIN_ID);

        // To login
        rootNavigation.popToTop();

        // Send optimistic request to server to handle token invalidation
    };

    return (
        <View className="flex-1 justify-end mb-2">
            <View
                className="bg-white rounded-xl h-1/6"
                onTouchStart={(e) => {
                    e.stopPropagation();
                }}
            >
                <View className="flex-1">
                    <IconLabelButton
                        iconPack="Feather"
                        iconProps={{
                            name: "settings",
                            size: 24,
                            color: customColors.black,
                        }}
                        text={PROFILE_UPDATE_PREF}
                        textClassName="text-base text-gray-800 font-normal"
                        buttonClassName="px-4 flex-1 space-x-3 items-center"
                        buttonProps={{ onPress: handleOpenSetPreferences }}
                    />
                    <IconLabelButton
                        iconPack="Material"
                        iconProps={{
                            name: "logout",
                            size: 24,
                            color: customColors.black,
                        }}
                        text={PROFILE_LOGOUT}
                        textClassName="text-base text-gray-800 font-normal"
                        buttonClassName="px-4 flex-1 space-x-3 items-center"
                        buttonProps={{ onPress: handleLogout }}
                    />
                </View>
            </View>
        </View>
    );
};

export default SettingMenu;

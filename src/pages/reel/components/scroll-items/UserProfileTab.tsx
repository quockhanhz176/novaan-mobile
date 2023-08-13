import React, { memo, type ReactElement } from "react";
import UserProfile from "@/pages/user-profile/UserProfile";
import { View } from "react-native";

interface UserProfileTabProps {
    userId: string;
    showBackButton: boolean;
    userProfileVisible: boolean;
}

const UserProfileTab = ({
    userId,
    showBackButton,
    userProfileVisible,
}: UserProfileTabProps): ReactElement<UserProfileTabProps> => {
    if (!userProfileVisible) {
        return <View></View>;
    }

    return (
        <View className="flex-1 w-screen">
            <UserProfile userId={userId} showBackButton={showBackButton} />
        </View>
    );
};

export default memo(UserProfileTab);

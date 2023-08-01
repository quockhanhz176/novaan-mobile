import React, { memo, useEffect, type ReactElement, useState } from "react";
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
    const [rendered, setRendered] = useState(false);
    useEffect(() => {
        if (!rendered && userProfileVisible) {
            setRendered(true);
        }
    }, [userProfileVisible]);

    if (!userProfileVisible || !rendered) {
        return <View></View>;
    }

    return (
        <View className="flex-1 w-screen">
            <UserProfile userId={userId} showBackButton={showBackButton} />
        </View>
    );
};

export default memo(UserProfileTab);

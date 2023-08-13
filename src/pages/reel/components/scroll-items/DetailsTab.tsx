import React, { memo, useEffect, type ReactElement, useState } from "react";
import { View } from "react-native";
import Details from "../../pages/details/Details";

interface UserProfileTabProps {
    visible: boolean;
}

const DetailsTab = ({
    visible,
}: UserProfileTabProps): ReactElement<UserProfileTabProps> => {
    const [rendered, setRendered] = useState(false);
    useEffect(() => {
        if (!rendered && visible) {
            setRendered(true);
        }
    }, [visible]);

    if (!visible || !rendered) {
        return <View></View>;
    }

    return (
        <View className="flex-1 w-screen">
            <Details />
        </View>
    );
};

export default memo(DetailsTab);

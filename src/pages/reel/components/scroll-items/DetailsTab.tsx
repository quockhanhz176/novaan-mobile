import React, { type ReactElement } from "react";
import { View } from "react-native";
import Details from "../../pages/details/Details";
import OverlayLoading from "@/common/components/OverlayLoading";

interface DetailsTabProps {
    detailsTabVisible: boolean;
}

const DetailsTab = ({
    detailsTabVisible,
}: DetailsTabProps): ReactElement<DetailsTabProps> => {
    if (!detailsTabVisible) {
        return <OverlayLoading />;
    }

    return (
        <View className="flex-1 w-screen">
            <Details />
        </View>
    );
};

export default DetailsTab;

import React, { type ReactElement } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const OverlayLoading = (): ReactElement => {
    return (
        <ActivityIndicator
            animating={true}
            color={MD2Colors.red400}
            size={100}
            className="absolute top-0 bottom-0 right-0 left-0 bg-gray-200 opacity-75"
        />
    );
};

export default OverlayLoading;

import React, { type ReactNode, type FC } from "react";
import { TouchableWithoutFeedback, View, type ViewProps } from "react-native";

interface TouchableViewProps extends ViewProps {
    onPress?: () => void;
    children?: ReactNode;
}

const TouchableView: FC<TouchableViewProps> = ({
    onPress,
    children,
    ...otherViewProps
}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View {...otherViewProps}>{children}</View>
        </TouchableWithoutFeedback>
    );
};

export default TouchableView;

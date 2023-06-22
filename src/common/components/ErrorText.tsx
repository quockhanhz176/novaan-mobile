import React, { type ReactNode, type ReactElement } from "react";
import { Text } from "react-native";

interface ErrorTextProps {
    children?: ReactNode;
}

const ErrorText = (props: ErrorTextProps): ReactElement<ErrorTextProps> => {
    const { children } = props;
    return <Text className="italic text-sm text-cwarning">{children}</Text>;
};
export default ErrorText;

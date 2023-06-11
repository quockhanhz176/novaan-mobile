import React, { type ReactElement } from "react";
import { Text, TouchableOpacity } from "react-native";

interface AuthButtonProps {
    onPress: () => void;
    title: string;
}

const AuthButton = (props: AuthButtonProps): ReactElement<AuthButtonProps> => {
    const { onPress, title } = props;

    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-full px-8 py-4 rounded-lg items-center"
            style={{ backgroundColor: "#149575" }}
        >
            <Text className="text-lg font-semibold text-white">{title}</Text>
        </TouchableOpacity>
    );
};

export default AuthButton;

import React, { type ReactElement } from "react";
import { Text, TouchableOpacity } from "react-native";

interface AuthButtonProps {
    onPress: () => void;
    disabled?: boolean;
    title: string;
}

const AuthButton = (props: AuthButtonProps): ReactElement<AuthButtonProps> => {
    const { onPress, title, disabled = false } = props;

    return (
        <TouchableOpacity
            onPress={onPress}
            className="w-full px-8 py-4 rounded-lg items-center bg-cprimary-300"
            disabled={disabled}
        >
            <Text className="text-lg font-semibold text-white">{title}</Text>
        </TouchableOpacity>
    );
};

export default AuthButton;

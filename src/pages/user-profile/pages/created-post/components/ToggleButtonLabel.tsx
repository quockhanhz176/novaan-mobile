import React, { type ReactElement } from "react";
import { Text } from "react-native";

interface ToggleButtonLabelProps {
    label: string;
    isChecked: boolean;
}

const ToggleButtonLabel = ({
    label,
    isChecked,
}: ToggleButtonLabelProps): ReactElement<ToggleButtonLabelProps> => {
    if (isChecked) {
        return <Text className="text-white">{label}</Text>;
    }

    return <Text className="text-gray-800">{label}</Text>;
};

export default ToggleButtonLabel;

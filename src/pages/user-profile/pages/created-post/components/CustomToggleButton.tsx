import React from "react";
import { customColors } from "@root/tailwind.config";
import { type ReactElement } from "react";
import { ToggleButton } from "react-native-paper";
import ToggleButtonLabel from "./ToggleButtonLabel";
import { type ViewStyle } from "react-native";

interface CustomToggleButtonProps {
    label: string;
    value: string;
    isChecked: boolean;
    style: ViewStyle;
}

const CustomToggleButton = ({
    label,
    value,
    isChecked,
    style,
}: CustomToggleButtonProps): ReactElement<CustomToggleButtonProps> => {
    return (
        <ToggleButton
            style={{
                backgroundColor: isChecked
                    ? customColors.cprimary["300"]
                    : "#FFF",
                ...style,
            }}
            icon={() => (
                <ToggleButtonLabel label={label} isChecked={isChecked} />
            )}
            value={value}
            status={isChecked ? "checked" : "unchecked"}
        />
    );
};

export default CustomToggleButton;

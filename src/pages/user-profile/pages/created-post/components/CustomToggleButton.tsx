import React from "react";
import { customColors } from "@root/tailwind.config";
import { type ReactElement } from "react";
import { ToggleButton } from "react-native-paper";
import ToggleButtonLabel from "./ToggleButtonLabel";

interface CustomToggleButtonProps {
    label: string;
    value: string;
    isChecked: boolean;
}

const CustomToggleButton = ({
    label,
    value,
    isChecked,
}: CustomToggleButtonProps): ReactElement<CustomToggleButtonProps> => {
    return (
        <ToggleButton
            style={{
                backgroundColor: isChecked
                    ? customColors.cprimary["300"]
                    : "#FFF",
                width: 96,
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

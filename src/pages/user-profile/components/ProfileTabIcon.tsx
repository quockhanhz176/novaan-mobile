import { customColors } from "@root/tailwind.config";
import React, { type ReactElement } from "react";
import IconMaterialC from "react-native-vector-icons/MaterialCommunityIcons";

interface ProfileTabIconProps {
    focused: boolean;
    icon: string;
}

const ProfileTabIcon = ({
    focused,
    icon,
}: ProfileTabIconProps): ReactElement => {
    return (
        <IconMaterialC
            name={icon}
            size={24}
            color={
                focused
                    ? customColors.cprimary["400"]
                    : customColors.cgrey.platinum
            }
        />
    );
};

export default ProfileTabIcon;

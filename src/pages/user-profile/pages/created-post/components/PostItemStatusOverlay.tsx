import { customColors } from "@root/tailwind.config";
import React, { type ReactElement, memo, useMemo } from "react";
import { View } from "react-native";
import MaterialCIcon from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * Pending = 0
 * Approved = 1
 * Rejected = 2
 * Reported = 3
 */
interface PostItemStatusOverlayProps {
    status: number;
}

/**
 * Should be use within a relative container
 * @returns Overlay component that show a post status with icon
 */
const PostItemStatusOverlay = ({
    status,
}: PostItemStatusOverlayProps): ReactElement<PostItemStatusOverlayProps> => {
    const iconFromStatus = useMemo(() => {
        switch (status) {
            case 0:
                return "clock-time-seven-outline";
            case 1:
                return "checkbox-marked-circle-outline";
            case 2:
                return "sticker-alert-outline";
            case 3:
                return "sticker-alert-outline";
            default:
                return "clock-time-seven-outline";
        }
    }, [status]);

    return (
        <View className="flex-1 absolute top-0 right-0 bottom-0 left-0 z-10">
            <View className="flex-1 justify-start items-start m-2">
                <MaterialCIcon
                    name={iconFromStatus}
                    size={26}
                    color={
                        status < 2
                            ? customColors.cprimary["200"]
                            : customColors.heart
                    }
                />
            </View>
        </View>
    );
};

export default memo(PostItemStatusOverlay);

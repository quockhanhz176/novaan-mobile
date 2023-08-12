import { type PostStatus } from "@/api/post/types/PostResponse";
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
    status: PostStatus;
}

/**
 * Should be use within a relative container
 * @returns Overlay component that show a post status with icon
 */
const PostItemStatusOverlay = ({
    status,
}: PostItemStatusOverlayProps): ReactElement<PostItemStatusOverlayProps> => {
    const iconFromStatus: { icon: string; color: string } = useMemo((): {
        icon: string;
        color: string;
    } => {
        switch (status) {
            case "Pending":
                return {
                    icon: "clock-time-seven-outline",
                    color: customColors.black,
                };
            case "Approved":
                return {
                    icon: "checkbox-marked-circle-outline",
                    color: customColors.cprimary["300"],
                };
            case "Rejected":
                return { icon: "alert", color: customColors.heart };
            case "Reported":
                return { icon: "flag", color: customColors.heart };
            default:
                return {
                    icon: "clock-time-seven-outline",
                    color: customColors.black,
                };
        }
    }, [status]);

    return (
        <View className="flex-1 absolute top-0 right-0 bottom-0 left-0 z-10">
            <View className="flex-1 justify-start items-start m-2">
                <MaterialCIcon
                    name={iconFromStatus.icon}
                    size={26}
                    color={iconFromStatus.color}
                />
            </View>
        </View>
    );
};

export default memo(PostItemStatusOverlay);

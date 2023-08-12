import {
    PROFILE_POST_REASON,
    PROFILE_POST_REJECTED_MSG,
    PROFILE_POST_REPORTED_MSG,
    PROFILE_POST_WARNING,
    PROFILE_POST_WARNING_ACCEPT,
} from "@/common/strings";
import React, { useContext, type ReactElement, useMemo, memo } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { ScrollItemContext } from "./ScrollItemv2";

interface AdminCommentsProps {
    onDismiss: () => void;
}

const AdminComments = ({
    onDismiss,
}: AdminCommentsProps): ReactElement<AdminCommentsProps> => {
    const { currentPost } = useContext(ScrollItemContext);

    const adminMessageTitle = useMemo(() => {
        if (currentPost == null) {
            return "";
        }

        return currentPost.status === "Rejected"
            ? PROFILE_POST_REJECTED_MSG
            : PROFILE_POST_REPORTED_MSG;
    }, [currentPost]);

    if (currentPost == null) {
        return <View></View>;
    }

    return (
        <View className="flex-1 justify-center mb-2">
            <View
                className="bg-white rounded-xl py-4 w-11/12 mx-auto h-auto"
                onTouchStart={(e) => {
                    e.stopPropagation();
                }}
            >
                <View className="px-4 start justify-between items-center">
                    <View className="w-full items-start justify-center">
                        <Text className="text-lg font-semibold">
                            {PROFILE_POST_WARNING}
                        </Text>
                        <View className="mt-1">
                            <Text className="text-base">
                                {adminMessageTitle}
                            </Text>
                        </View>
                        <View className="mt-1">
                            <Text className="text-base">
                                {PROFILE_POST_REASON}
                            </Text>
                        </View>
                        <View className="mt-2">
                            <Text className="text-base">
                                • {currentPost.adminComment?.comment}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="items-center justify-center px-12 py-2 mt-6 mb-2 rounded-lg bg-cprimary-300"
                        delayPressIn={0}
                        onPress={onDismiss}
                    >
                        <Text className="text-white">
                            {PROFILE_POST_WARNING_ACCEPT}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default memo(AdminComments);

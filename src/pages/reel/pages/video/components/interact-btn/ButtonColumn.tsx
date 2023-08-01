import { type FC, memo } from "react";
import React, { type GestureResponderEvent, View } from "react-native";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import SaveButton from "./SaveButton";
import VideoButton from "../VideoButton";
import { REEL_VIDEO_DETAILS } from "@/common/strings";
import ReportButton from "./ReportButton";

interface ButtonColumnProps {
    onShowDetails: () => void;
}

const ButtonColumn: FC<ButtonColumnProps> = ({
    onShowDetails,
}: ButtonColumnProps) => {
    const onTouchEnd = (event: GestureResponderEvent): void => {
        event.stopPropagation();
    };

    return (
        <View className="pr-2 space-y-4" onTouchEnd={onTouchEnd}>
            <View>
                <LikeButton />
            </View>
            <View>
                <CommentButton />
            </View>
            <View>
                <SaveButton />
            </View>
            <View>
                <VideoButton
                    iconPack="Community"
                    icon="newspaper-variant"
                    text={REEL_VIDEO_DETAILS}
                    onPress={onShowDetails}
                />
            </View>
            <View>
                <ReportButton />
            </View>
        </View>
    );
};

export default memo(ButtonColumn, () => true);

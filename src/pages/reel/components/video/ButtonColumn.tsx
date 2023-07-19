import { type FC, memo } from "react";
import React, { type GestureResponderEvent, View } from "react-native";
import VideoButton from "./VideoButton";
import type Post from "../../types/Post";
import { customColors } from "@root/tailwind.config";
import {
    REEL_VIDEO_DETAILS,
    REEL_VIDEO_REPORT,
    REEL_VIDEO_SAVE,
} from "@/common/strings";
import type ScrollItemController from "../../types/ScrollItemController";
import numeral from "numeral";

interface ButtonColumnProps {
    post: Post;
    commentCount: number;
    scrollItemController: ScrollItemController;
}

const ButtonColumn: FC<ButtonColumnProps> = ({
    post,
    commentCount,
    scrollItemController,
}) => {
    const {
        liked,
        saved,
        likePressed,
        savePressed,
        showRating: ratingPressed,
        showReport: reportPressed,
    } = scrollItemController;

    const onTouchEnd = (event: GestureResponderEvent): void => {
        event.stopPropagation();
    };

    return (
        <View className="space-y-5 pr-3" onTouchEnd={onTouchEnd}>
            <VideoButton
                text={numeral(post.likeCount).format("0 a")}
                iconColor={liked ? customColors.heart : "white"}
                onPress={likePressed}
            />
            <VideoButton
                iconPack="Community"
                icon="message-text"
                text={commentCount.toString()}
                onPress={ratingPressed}
            />
            <VideoButton
                icon="md-bookmark"
                text={REEL_VIDEO_SAVE}
                onPress={savePressed}
                iconColor={saved ? customColors.save : "white"}
            />
            <VideoButton
                iconPack="Community"
                icon="newspaper-variant"
                text={REEL_VIDEO_DETAILS}
                onPress={scrollItemController.showDetails}
            />
            <VideoButton
                iconPack="Material"
                icon="flag"
                text={REEL_VIDEO_REPORT}
                onPress={reportPressed}
            />
        </View>
    );
};

export default memo(ButtonColumn);

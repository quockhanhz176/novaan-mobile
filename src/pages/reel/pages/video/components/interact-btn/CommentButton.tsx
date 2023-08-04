import React, { type ReactElement, useContext, memo, useEffect } from "react";
import VideoButton from "../VideoButton";
import CustomModal from "@/common/components/CustomModal";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";
import Comments from "@/pages/reel/components/comments/Comments";
import { View } from "react-native";
import { REEL_COMMENTS_TITLE } from "@/common/strings";
import useBooleanHook from "@/common/components/BooleanHook";

const CommentButton = (): ReactElement => {
    const { pauseVideo, resumeVideo } = useContext(ScrollItemContext);

    const [commentsVisible, hideComments, showComments] = useBooleanHook();

    useEffect(() => {
        commentsVisible ? pauseVideo() : resumeVideo();
    }, [commentsVisible]);

    return (
        <>
            <VideoButton
                iconPack="Community"
                icon="message-text"
                text={REEL_COMMENTS_TITLE}
                onPress={showComments}
            />
            <CustomModal visible={commentsVisible} onDismiss={hideComments}>
                <View
                    className="flex-1"
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Comments closeComments={hideComments} />
                </View>
            </CustomModal>
        </>
    );
};

export default memo(CommentButton);

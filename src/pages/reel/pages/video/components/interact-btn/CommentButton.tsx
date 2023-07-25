import React, { type ReactElement, useState, useContext } from "react";
import VideoButton from "../VideoButton";
import CustomModal from "@/common/components/CustomModal";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";
import Comments from "@/pages/reel/components/comments/Comments";
import { MenuProvider } from "react-native-popup-menu";
import { View } from "react-native";
import { REEL_COMMENTS_TITLE } from "@/common/strings";

const CommentButton = (): ReactElement => {
    const { pauseVideo, resumeVideo } = useContext(ScrollItemContext);
    const [showComment, setShowComment] = useState(false);

    const handleCommentPress = (): void => {
        setShowComment(true);
        pauseVideo();
    };

    const handleCloseComments = (): void => {
        setShowComment(false);
        resumeVideo();
    };

    return (
        <>
            <VideoButton
                iconPack="Community"
                icon="message-text"
                text={REEL_COMMENTS_TITLE}
                onPress={handleCommentPress}
            />
            <CustomModal visible={showComment} onDismiss={handleCloseComments}>
                <View
                    className="flex-1"
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <MenuProvider>
                        <Comments closeComments={handleCloseComments} />
                    </MenuProvider>
                </View>
            </CustomModal>
        </>
    );
};

export default CommentButton;

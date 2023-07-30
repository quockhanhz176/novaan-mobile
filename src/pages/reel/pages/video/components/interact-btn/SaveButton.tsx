import React, { type ReactElement, useCallback, useContext, memo } from "react";
import VideoButton from "../VideoButton";
import { REEL_VIDEO_SAVE } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { type PostInteraction, usePostInteract } from "@/api/post/PostApiHook";
import { debounce } from "lodash";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";

const SaveButton = (): ReactElement => {
    const { currentPost, currentUserId, saved, handleSave, handleUnsave } =
        useContext(ScrollItemContext);

    const { savePost } = usePostInteract();

    // Memoize debounce function, crucial for this to work
    const sendSaveRequest = useCallback(
        debounce(
            async (saved: boolean): Promise<void> => {
                if (currentPost == null) {
                    return;
                }
                const interaction: PostInteraction = {
                    action: !saved,
                    postId: currentPost.id,
                    postType:
                        currentPost.type === "recipe"
                            ? "Recipe"
                            : "CulinaryTip",
                };
                await savePost(interaction, currentPost.title);
            },
            1000,
            {}
        ),
        [currentPost, currentUserId]
    );

    const handleSavePost = useCallback(
        async (saved: boolean): Promise<void> => {
            if (currentPost == null) {
                return;
            }

            saved ? handleUnsave() : handleSave();
            sendSaveRequest.cancel();
            await sendSaveRequest(saved);
        },
        []
    );

    return (
        <VideoButton
            icon="md-bookmark"
            text={REEL_VIDEO_SAVE}
            onPress={async () => {
                await handleSavePost(saved);
            }}
            iconColor={saved ? customColors.save : "white"}
        />
    );
};

export default memo(SaveButton);

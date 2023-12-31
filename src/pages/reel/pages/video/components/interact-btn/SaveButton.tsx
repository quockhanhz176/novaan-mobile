import React, {
    type ReactElement,
    useCallback,
    useContext,
    memo,
    useMemo,
} from "react";
import VideoButton from "../VideoButton";
import { REEL_VIDEO_SAVE } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { usePostInteract } from "@/api/post/PostApiHook";
import { debounce } from "lodash";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";
import { type PostInteraction } from "@/api/post/types/hooks.type";
import { unstable_serialize, useSWRConfig } from "swr";
import { getUserSavedUrl } from "@/api/profile/ProfileApi";
import { mutateGetKey } from "@/api/baseApiHook";

const SaveButton = (): ReactElement => {
    const { currentPost, currentUserId, saved, handleSave, handleUnsave } =
        useContext(ScrollItemContext);

    const { savePost } = usePostInteract();

    const { mutate } = useSWRConfig();

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
                await savePost(interaction, currentUserId);
                await mutate(
                    unstable_serialize(
                        mutateGetKey(getUserSavedUrl(currentUserId))
                    )
                );
            },
            1000,
            {}
        ),
        [currentPost, currentUserId]
    );

    const handleSavePost = useCallback(async (): Promise<void> => {
        if (currentPost == null || currentPost.status !== "Approved") {
            return;
        }

        saved ? handleUnsave() : handleSave();
        sendSaveRequest.cancel();
        await sendSaveRequest(saved);
    }, [saved, currentPost]);

    const buttonColor = useMemo(() => {
        // Approved = 1
        if (currentPost == null || currentPost.status !== "Approved") {
            return customColors.cgrey.platinum;
        }

        if (saved) {
            return customColors.save;
        } else {
            return "white";
        }
    }, [saved, currentPost]);

    return (
        <VideoButton
            icon="md-bookmark"
            text={REEL_VIDEO_SAVE}
            onPress={handleSavePost}
            iconColor={buttonColor}
        />
    );
};

export default memo(SaveButton);

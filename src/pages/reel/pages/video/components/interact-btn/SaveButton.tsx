import React, {
    useState,
    type ReactElement,
    useCallback,
    useContext,
    useEffect,
} from "react";
import VideoButton from "../VideoButton";
import { REEL_VIDEO_SAVE } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { type PostInteraction, usePostInteract } from "@/api/post/PostApiHook";
import { debounce } from "lodash";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";

const SaveButton = (): ReactElement => {
    const { currentPost, currentUserId, dispatch } =
        useContext(ScrollItemContext);
    const { savePost } = usePostInteract();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(currentPost?.isSaved ?? false);
    }, [currentPost?.isSaved]);

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
                const result = await savePost(interaction, currentUserId);
                if (!result) {
                    // Revert save
                    setSaved(saved);
                    dispatch({ type: saved ? "SAVE_POST" : "UNSAVE_POST" });
                }
            },
            1000,
            {}
        ),
        [currentPost, currentUserId]
    );

    const handleSavePost = async (saved: boolean): Promise<void> => {
        setSaved(!saved);
        dispatch({ type: saved ? "UNSAVE_POST" : "SAVE_POST" });

        // Cancel last request to avoid duplicate request
        sendSaveRequest.cancel();
        await sendSaveRequest(saved);
    };

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

export default SaveButton;

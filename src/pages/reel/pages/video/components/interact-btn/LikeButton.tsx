import React, {
    type ReactElement,
    useCallback,
    useContext,
    memo,
    useMemo,
} from "react";
import VideoButton from "../VideoButton";
import { customColors } from "@root/tailwind.config";
import numeral from "numeral";
import { usePostInteract } from "@/api/post/PostApiHook";
import { debounce } from "lodash";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";
import { type PostInteraction } from "@/api/post/types/hooks.type";

const LikeButton = (): ReactElement => {
    const { currentUserId, currentPost, likeInfo, handleLike, handleUnlike } =
        useContext(ScrollItemContext);

    const { likePost } = usePostInteract();

    const sendLikeRequest = useCallback(
        debounce(async (liked: boolean): Promise<void> => {
            if (currentPost == null) {
                return;
            }

            const interaction: PostInteraction = {
                action: !liked,
                postId: currentPost.id,
                postType:
                    currentPost.type === "recipe" ? "Recipe" : "CulinaryTip",
            };
            await likePost(interaction, currentUserId);
        }, 1000),
        [currentPost, currentUserId]
    );

    const handleLikePress = useCallback(async (): Promise<void> => {
        // Ignore like request when the post is not approved
        // Approved = 1
        if (currentPost == null || currentPost.status !== "Approved") {
            return;
        }

        likeInfo.liked ? handleUnlike() : handleLike();
        sendLikeRequest.cancel();
        await sendLikeRequest(likeInfo.liked);
    }, [likeInfo.liked, currentPost]);

    const buttonColor = useMemo(() => {
        // Approved = 1
        if (currentPost == null || currentPost.status !== "Approved") {
            return customColors.cgrey.platinum;
        }

        if (likeInfo.liked) {
            return customColors.heart;
        } else {
            return "white";
        }
    }, [likeInfo.liked, currentPost]);

    return (
        <VideoButton
            text={numeral(likeInfo.likeCount).format("0 a")}
            iconColor={buttonColor}
            onPress={handleLikePress}
        />
    );
};

export default memo(LikeButton);

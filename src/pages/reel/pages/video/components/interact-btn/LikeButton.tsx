import React, { type ReactElement, useCallback, useContext, memo } from "react";
import VideoButton from "../VideoButton";
import { customColors } from "@root/tailwind.config";
import numeral from "numeral";
import { type PostInteraction, usePostInteract } from "@/api/post/PostApiHook";
import { debounce } from "lodash";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";

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

    const handleLikePress = async (liked: boolean): Promise<void> => {
        liked ? handleUnlike() : handleLike();
        sendLikeRequest.cancel();
        await sendLikeRequest(liked);
    };

    return (
        <VideoButton
            text={numeral(likeInfo.likeCount).format("0 a")}
            iconColor={likeInfo.liked ? customColors.heart : "white"}
            onPress={async () => {
                await handleLikePress(likeInfo.liked);
            }}
        />
    );
};

export default memo(LikeButton);

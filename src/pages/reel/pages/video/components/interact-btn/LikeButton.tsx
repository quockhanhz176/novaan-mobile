import React, {
    useState,
    type ReactElement,
    useCallback,
    useContext,
} from "react";
import VideoButton from "../VideoButton";
import { customColors } from "@root/tailwind.config";
import numeral from "numeral";
import { type PostInteraction, usePostInteract } from "@/api/post/PostApiHook";
import { debounce } from "lodash";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";

const LikeButton = (): ReactElement => {
    const { currentPost, currentUserId, dispatch } =
        useContext(ScrollItemContext);
    const { likePost } = usePostInteract();
    const [like, setLike] = useState(currentPost?.isLiked ?? false);

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
            const succeed = await likePost(interaction, currentUserId);
            if (!succeed) {
                // Revert like
                setLike(liked);
                dispatch({ type: liked ? "LIKE_POST" : "UNLIKE_POST" });
            }
        }, 1000),
        [currentPost, currentUserId]
    );

    const handleLikePress = async (liked: boolean): Promise<void> => {
        setLike(!liked);
        dispatch({ type: liked ? "UNLIKE_POST" : "LIKE_POST" });

        sendLikeRequest.cancel();
        await sendLikeRequest(liked);
    };

    return (
        <VideoButton
            text={numeral(currentPost?.likeCount).format("0 a")}
            iconColor={like ? customColors.heart : "white"}
            onPress={async () => {
                await handleLikePress(like);
            }}
        />
    );
};

export default LikeButton;

import React, {
    memo,
    useContext,
    type ReactElement,
    useState,
    useEffect,
} from "react";
import type PostComment from "../../types/PostComment";
import { REEL_COMMENTS_BUTTON_TITLE } from "@/common/strings";
import { View, TouchableOpacity, Text } from "react-native";
import { Divider } from "react-native-paper";
import CommentItem from "./CommentItem";
import IconFeather from "react-native-vector-icons/Feather";
import { ScrollItemContext } from "../scroll-items/ScrollItemv2";
import FastImage from "react-native-fast-image";
import { type ProfileInfo } from "@/api/profile/types";
import userProfileServices from "@/pages/user-profile/services/userProfileServices";

interface CommentListHeaderProps {
    userComment?: PostComment;
    showAddEdit: () => void;
    showCommentMenu: () => void;
}

const CommentListHeader = ({
    userComment,
    showAddEdit,
    showCommentMenu,
}: CommentListHeaderProps): ReactElement<CommentListHeaderProps> => {
    const { currentPost } = useContext(ScrollItemContext);
    const [userProfile, setUseProfile] = useState<ProfileInfo | undefined>(
        userProfileServices.cachedUserProfile
    );

    useEffect(() => {
        if (userProfile == null) {
            userProfileServices.getUserProfile().then(
                (result) => {
                    if (result != null) {
                        setUseProfile(result);
                    }
                },
                () => {}
            );
        }
    }, []);

    if (userComment === undefined) {
        return (
            <View className="flex-1">
                <Divider />
                <View className="flex-1 flex-row justify-between items-center px-4 py-2 space-x-4">
                    <View className="w-[25] h-[25] rounded-full bg-xanthous items-center justify-center overflow-hidden">
                        <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                            <IconFeather name="user" size={17} />
                        </View>
                        <FastImage
                            className="w-full h-full"
                            source={{ uri: userProfile?.avatar }}
                        />
                    </View>
                    <TouchableOpacity
                        className="grow bg-cgrey-whitesmoke rounded-lg p-2 justify-center"
                        onPress={showAddEdit}
                        disabled={
                            currentPost == null ||
                            currentPost.status !== "Approved"
                        }
                    >
                        <Text className="text-cgrey-grey">
                            {REEL_COMMENTS_BUTTON_TITLE}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Divider />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <CommentItem
                comment={userComment}
                isUserComment
                showCommentMenu={showCommentMenu}
            />
        </View>
    );
};

export default memo(CommentListHeader);

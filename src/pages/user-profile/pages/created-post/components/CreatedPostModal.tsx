import React, { type ReactElement } from "react";
import { Modal, View, TouchableOpacity, Text } from "react-native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type RootStackParamList } from "@/types/navigation";
import CustomModal from "@/common/components/CustomModal";
import { PROFILE_POSTED_TITLE } from "@/common/strings";
import InfiniteScroll from "@/pages/reel/InfiniteScrollv2";
import PostSettingMenu from "./PostSettingMenu";
import useBooleanHook from "@/common/components/BooleanHook";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { type MinimalPostInfo } from "@/api/profile/types";
import { useNavigation } from "@react-navigation/native";
import { type Undefinable } from "@/types/app";

interface CreatedPostModalProps {
    visible: boolean;
    onDimiss: () => void;
    viewItem: Undefinable<MinimalPostInfo>;
}

const CreatedPostModal = ({
    visible,
    onDimiss,
    viewItem,
}: CreatedPostModalProps): ReactElement<CreatedPostModalProps> => {
    const rootNavigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [postSettingOpen, hidePostSetting, showPostSetting] =
        useBooleanHook();

    const handleEditPost = (): void => {
        if (viewItem == null) {
            return;
        }

        if (viewItem.type === "recipe") {
            hidePostSetting();
            rootNavigation.navigate("CreateRecipe", { postId: viewItem.id });
        } else {
            hidePostSetting();
            rootNavigation.push("CreateTip", { postId: viewItem.id });
        }

        onDimiss();
    };

    const handleDeletePost = (): void => {
        console.log("Deleting post...");
        hidePostSetting();
        onDimiss();
    };

    if (viewItem == null) {
        return <View></View>;
    }

    return (
        <>
            <Modal animationType="slide" visible={visible}>
                <View style={{ height: 50 }} className="flex-row">
                    <View className="flex-1 justify-center items-start">
                        <TouchableOpacity
                            onPress={onDimiss}
                            className="px-4 py-2 rounded-lg"
                        >
                            <MaterialIcon name="arrow-back" size={24} />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-base">
                            {PROFILE_POSTED_TITLE}
                        </Text>
                    </View>
                    <View className="flex-1 justify-center items-end">
                        <TouchableOpacity
                            className="px-4 py-2 rounded-lg"
                            onPress={showPostSetting}
                        >
                            <IonIcon
                                name="ios-ellipsis-vertical-sharp"
                                size={18}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <InfiniteScroll
                    postIds={[
                        {
                            postId: viewItem.id,
                            postType:
                                viewItem.type === "recipe"
                                    ? "Recipe"
                                    : "CulinaryTip",
                        },
                    ]}
                    showUserProfile={false}
                />
            </Modal>
            <CustomModal visible={postSettingOpen} onDismiss={hidePostSetting}>
                <PostSettingMenu
                    onEditPost={handleEditPost}
                    onDeletePost={handleDeletePost}
                />
            </CustomModal>
        </>
    );
};

export default CreatedPostModal;

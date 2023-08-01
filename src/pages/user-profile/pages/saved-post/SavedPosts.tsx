import { useUserSavedPost } from "@/api/profile/ProfileApi";
import React, {
    useContext,
    type ReactElement,
    useMemo,
    useEffect,
    useState,
} from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { UserProfileContext } from "../../UserProfile";
import { ToggleButton } from "react-native-paper";
import CustomToggleButton from "../created-post/components/CustomToggleButton";
import {
    PROFILE_EMPTY_RECIPE,
    PROFILE_EMPTY_TIPS,
    PROFILE_POSTED_TITLE,
} from "@/common/strings";
import CreatedPostList from "../created-post/components/CreatedPostList";
import EmptyCreatedPost from "../created-post/components/EmptyCreatedPost";
import { type Undefinable } from "@/types/app";
import { type MinimalPostInfo } from "@/api/profile/types";
import InfiniteScroll from "@/pages/reel/InfiniteScrollv2";
import IonIcon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

type ViewCategory = "recipe" | "tips";

const SavedPosts = (): ReactElement => {
    const { userInfo } = useContext(UserProfileContext);
    const {
        content,
        ended,
        getNext: getNextSavedPosts,
    } = useUserSavedPost(userInfo?.userId);

    const [fetching, setFetching] = useState(false);

    const [viewCategory, setViewCategory] = useState<ViewCategory>("recipe");
    const [viewingItem, setViewingItem] = useState(false);
    const [viewItem, setViewItem] =
        useState<Undefinable<MinimalPostInfo>>(undefined);

    const fetchMorePost = async (): Promise<void> => {
        if (ended) {
            return;
        }
        setFetching(true);
        await getNextSavedPosts();
        setFetching(false);
    };

    useEffect(() => {
        void fetchMorePost();
    }, [userInfo]);

    const savedRecipes: MinimalPostInfo[] = useMemo(
        () =>
            content
                .filter((post) => post.postType === "Recipe")
                .map(
                    (item): MinimalPostInfo => ({
                        id: item.postId,
                        type: "recipe",
                        title: item.postTitle,
                    })
                ),
        [content]
    );

    const savedTips: MinimalPostInfo[] = useMemo(
        () =>
            content
                .filter((tip) => tip.postType === "CulinaryTip")
                .map(
                    (item): MinimalPostInfo => ({
                        id: item.postId,
                        type: "tip",
                        title: item.postTitle,
                    })
                ),
        [content]
    );

    const recipesEmpty = useMemo(
        () => savedRecipes.length === 0,
        [savedRecipes]
    );
    const tipsEmpty = useMemo(() => savedTips.length === 0, [savedTips]);

    const handleChangeViewCategory = (value: ViewCategory): void => {
        if (value == null) {
            return;
        }
        setViewCategory(value);
    };

    const handleItemPress = (item: MinimalPostInfo): void => {
        setViewingItem(true);
        setViewItem(item);
    };

    const handleCloseItemView = (): void => {
        setViewingItem(false);
        setViewItem(undefined);
    };

    return (
        <View className="flex-1">
            <ToggleButton.Row
                style={{
                    borderRadius: 8,
                    marginTop: 16,
                    marginLeft: 8,
                }}
                onValueChange={handleChangeViewCategory}
                value={viewCategory}
            >
                <CustomToggleButton
                    label="Recipe"
                    value="recipe"
                    isChecked={viewCategory === "recipe"}
                />
                <CustomToggleButton
                    label="Tips"
                    value="tips"
                    isChecked={viewCategory === "tips"}
                />
            </ToggleButton.Row>
            {recipesEmpty ? (
                <EmptyCreatedPost
                    isShown={viewCategory === "recipe"}
                    label={PROFILE_EMPTY_RECIPE}
                />
            ) : (
                <CreatedPostList
                    hidden={viewCategory !== "recipe"}
                    data={savedRecipes}
                    loading={fetching}
                    handleItemPress={handleItemPress}
                    handleOnEndReached={fetchMorePost}
                />
            )}
            {tipsEmpty ? (
                <EmptyCreatedPost
                    isShown={viewCategory === "tips"}
                    label={PROFILE_EMPTY_TIPS}
                />
            ) : (
                <CreatedPostList
                    hidden={viewCategory !== "tips"}
                    data={savedTips}
                    loading={fetching}
                    handleItemPress={handleItemPress}
                    handleOnEndReached={fetchMorePost}
                />
            )}
            <Modal animationType="slide" visible={viewingItem}>
                <View style={{ height: 50 }} className="flex-row">
                    <View className="flex-1 justify-center items-start">
                        <Pressable
                            onPress={handleCloseItemView}
                            className="px-4 py-2 rounded-lg"
                        >
                            <MaterialIcon name="arrow-back" size={24} />
                        </Pressable>
                    </View>
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-base">
                            {PROFILE_POSTED_TITLE}
                        </Text>
                    </View>
                    <View className="flex-1 justify-center items-end">
                        {/* TODO: Add delete + edit post options here */}
                        <TouchableOpacity className="px-4 py-2 rounded-lg">
                            <IonIcon
                                name="ios-ellipsis-vertical-sharp"
                                size={18}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {viewItem != null && (
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
                        showUserProfile={true}
                    />
                )}
            </Modal>
        </View>
    );
};

export default SavedPosts;

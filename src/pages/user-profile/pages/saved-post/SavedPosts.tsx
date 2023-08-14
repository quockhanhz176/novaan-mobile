import { useUserSavedPost } from "@/api/profile/ProfileApi";
import React, {
    useContext,
    type ReactElement,
    useMemo,
    useEffect,
    useState,
    memo,
} from "react";
import { UserProfileContext } from "../../UserProfile";
import { ToggleButton } from "react-native-paper";
import CustomToggleButton from "../created-post/components/CustomToggleButton";
import { PROFILE_EMPTY_RECIPE, PROFILE_EMPTY_TIPS } from "@/common/strings";
import CreatedPostList from "../created-post/components/CreatedPostList";
import EmptyCreatedPost from "../created-post/components/EmptyCreatedPost";
import { type Undefinable } from "@/types/app";
import { type MinimalPostInfo } from "@/api/profile/types";
import PostDetailModal from "../created-post/components/PostDetailModal";
import { View } from "react-native";

type ViewCategory = "recipe" | "tips";

const SavedPosts = (): ReactElement => {
    const { userInfo } = useContext(UserProfileContext);
    const {
        content,
        ended,
        getNext: getNextSavedPosts,
    } = useUserSavedPost(userInfo?.userId);

    const [viewCategory, setViewCategory] = useState<ViewCategory>("recipe");
    const [viewingItem, setViewingItem] = useState(false);
    const [viewItem, setViewItem] =
        useState<Undefinable<MinimalPostInfo>>(undefined);

    const fetchMorePost = async (): Promise<void> => {
        if (ended) {
            return;
        }
        await getNextSavedPosts();
    };

    useEffect(() => {
        if (userInfo == null) {
            return;
        }
        void fetchMorePost();
    }, [userInfo]);

    const savedRecipes: MinimalPostInfo[] = useMemo(() => {
        if (content == null || content.length === 0) {
            return [];
        }
        return content
            .filter((post) => post.postType === "Recipe")
            .map(
                (item): MinimalPostInfo => ({
                    id: item.id,
                    type: "recipe",
                    title: item.postTitle,
                    thumbnail: item.thumbnail,
                })
            );
    }, [content]);

    const savedTips: MinimalPostInfo[] = useMemo(() => {
        if (content == null || content.length === 0) {
            return [];
        }
        return content
            .filter((tip) => tip.postType === "CulinaryTip")
            .map(
                (item): MinimalPostInfo => ({
                    id: item.id,
                    type: "tip",
                    title: item.postTitle,
                    thumbnail: item.thumbnail,
                })
            );
    }, [content]);

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
                    style={{
                        flex: 1,
                        marginRight: 6,
                        borderRadius: 8,
                        borderWidth: viewCategory === "recipe" ? 0 : 1,
                    }}
                    label="Recipe"
                    value="recipe"
                    isChecked={viewCategory === "recipe"}
                />
                <CustomToggleButton
                    style={{
                        flex: 1,
                        marginRight: 6,
                        borderRadius: 8,
                        borderWidth: viewCategory === "tips" ? 0 : 1,
                    }}
                    label="Tips"
                    value="tips"
                    isChecked={viewCategory === "tips"}
                />
            </ToggleButton.Row>
            <View className="mt-2">
                {recipesEmpty ? (
                    <EmptyCreatedPost
                        isShown={viewCategory === "recipe"}
                        label={PROFILE_EMPTY_RECIPE}
                    />
                ) : (
                    <CreatedPostList
                        hidden={viewCategory !== "recipe"}
                        data={savedRecipes}
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
                        handleItemPress={handleItemPress}
                        handleOnEndReached={fetchMorePost}
                    />
                )}
            </View>
            <PostDetailModal
                visible={viewingItem}
                onDimiss={handleCloseItemView}
                viewItem={viewItem}
            />
        </View>
    );
};

export default memo(SavedPosts);

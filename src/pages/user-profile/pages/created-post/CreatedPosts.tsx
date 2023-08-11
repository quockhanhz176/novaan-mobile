import { useUserRecipes, useUserTips } from "@/api/profile/ProfileApi";
import React, {
    useEffect,
    useState,
    type ReactElement,
    useContext,
    useMemo,
    memo,
} from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import InfiniteScroll from "@/pages/reel/InfiniteScrollv2";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
    PROFILE_EMPTY_RECIPE,
    PROFILE_EMPTY_TIPS,
    PROFILE_POSTED_TITLE,
} from "@/common/strings";
import { ToggleButton } from "react-native-paper";
import CustomToggleButton from "./components/CustomToggleButton";
import { UserProfileContext } from "../../UserProfile";
import CreatedPostList from "./components/CreatedPostList";
import EmptyCreatedPost from "./components/EmptyCreatedPost";
import type PostResponse from "@/api/post/types/PostResponse";
import { type Undefinable } from "@/types/app";
import CustomModal from "@/common/components/CustomModal";
import useBooleanHook from "@/common/components/BooleanHook";
import PostSettingMenu from "./components/PostSettingMenu";
import { useNavigation } from "@react-navigation/native";
import { type RootStackParamList } from "@/types/navigation";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type MinimalPostInfo } from "@/api/profile/types";

type ViewCategory = "recipe" | "tips";

interface CreatedPostsProps {
    showStatus?: boolean;
}

const CreatedPosts = ({
    showStatus = true,
}: CreatedPostsProps): ReactElement<CreatedPostsProps> => {
    const userProfileContext = useContext(UserProfileContext);
    const {
        getNext: getNextRecipes,
        content: recipes,
        ended: recipesEnded,
    } = useUserRecipes(userProfileContext.userInfo?.userId);

    const {
        getNext: getNextTips,
        content: tips,
        ended: tipsEnded,
    } = useUserTips(userProfileContext.userInfo?.userId);

    const formatRecipes: MinimalPostInfo[] = useMemo(() => {
        if (recipes.length === 0) {
            return [];
        }

        return recipes.map(
            (recipe): MinimalPostInfo => ({
                ...recipe,
                type: recipe.type === "Recipe" ? "recipe" : "tip",
            })
        );
    }, [recipes]);

    const formatTips: MinimalPostInfo[] = useMemo(() => {
        if (tips.length === 0) {
            return [];
        }

        return tips.map(
            (tip): MinimalPostInfo => ({
                ...tip,
                type: tip.type === "Recipe" ? "recipe" : "tip",
            })
        );
    }, [tips]);

    const [viewingItem, setViewingItem] = useState(false);
    const [viewItem, setViewItem] =
        useState<Undefinable<PostResponse>>(undefined);

    const [viewCategory, setViewCategory] = useState<ViewCategory>("recipe");
    const [fetching, setFetching] = useState(false);

    const [postSettingOpen, hidePostSetting, showPostSetting] =
        useBooleanHook();

    const recipesEmpty = useMemo(() => recipes.length === 0, [recipes]);
    const tipsEmpty = useMemo(() => tips.length === 0, [tips]);

    const rootNavigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Fetch data if it is currently empty
    useEffect(() => {
        if (viewCategory === "recipe" && recipesEmpty) {
            void getNextRecipes();
        }
        if (viewCategory === "tips" && tipsEmpty) {
            void getNextTips();
        }
    }, [viewCategory]);

    const fetchMorePost = async (): Promise<void> => {
        if (
            (viewCategory === "recipe" && (recipesEmpty || recipesEnded)) ||
            (viewCategory === "tips" && (tipsEmpty || tipsEnded))
        ) {
            return;
        }

        setFetching(true);
        if (viewCategory === "recipe") {
            await getNextRecipes();
        } else {
            await getNextTips();
        }
        setFetching(false);
    };

    // const postGetterProfile = async (index: number): Promise<Post | null> => {
    //     // Only allow viewing current item for now
    //     // TODO: Improve by adding option to navigate to a specific index in InfiniteScroll
    //     if (index !== 0) {
    //         return null;
    //     }

    //     if (viewItem === undefined) {
    //         return null;
    //     }

    //     const userInfo = userProfileContext.userInfo;
    //     if (userInfo == null) {
    //         return null;
    //     }

    //     const isRecipe = (item: PostResponse): item is RecipeResponse => {
    //         return "ingredients" in item;
    //     };

    //     if (viewCategory === "recipe" && isRecipe(viewItem)) {
    //         return {
    //             ...viewItem,
    //             type: "recipe",
    //             creator: userInfo,
    //             prepTime: getRecipeTime(moment.duration(viewItem.prepTime)),
    //             cookTime: getRecipeTime(moment.duration(viewItem.cookTime)),
    //         };
    //     }

    //     return {
    //         ...viewItem,
    //         type: "tip",
    //         creator: userInfo,
    //     };
    // };

    const handleItemPress = (item: PostResponse): void => {
        setViewingItem(true);
        setViewItem(item);
    };

    const handleCloseItemView = (): void => {
        setViewingItem(false);
        setViewItem(undefined);
    };

    const handleChangeViewCategory = (value: ViewCategory): void => {
        if (value == null) {
            return;
        }
        setViewCategory(value);
    };

    const handleEditPost = (): void => {
        if (viewItem == null) {
            return;
        }

        if (viewCategory === "recipe") {
            hidePostSetting();
            rootNavigation.navigate("CreateRecipe", { postId: viewItem.id });
        } else {
            hidePostSetting();
            rootNavigation.push("CreateTip", { postId: viewItem.id });
        }

        setViewingItem(false);
        setViewItem(undefined);
    };

    const handleDeletePost = (): void => {
        console.log("Post delete");
        hidePostSetting();
    };

    if (userProfileContext.userInfo == null) {
        return <View></View>;
    }

    return (
        <View className="flex-1 bg-white">
            <ToggleButton.Row
                style={{
                    marginTop: 16,
                    paddingHorizontal: 8,
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
                        marginLeft: 6,
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
                        data={formatRecipes}
                        loading={fetching}
                        handleItemPress={handleItemPress}
                        handleOnEndReached={fetchMorePost}
                        showStatus={showStatus}
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
                        data={formatTips}
                        loading={fetching}
                        handleItemPress={handleItemPress}
                        handleOnEndReached={fetchMorePost}
                        showStatus={showStatus}
                    />
                )}
            </View>
            <Modal animationType="slide" visible={viewingItem}>
                <View style={{ height: 50 }} className="flex-row">
                    <View className="flex-1 justify-center items-start">
                        <TouchableOpacity
                            onPress={handleCloseItemView}
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
                {viewItem != null && (
                    <InfiniteScroll
                        postIds={[
                            {
                                postId: viewItem.id,
                                postType:
                                    viewCategory === "recipe"
                                        ? "Recipe"
                                        : "CulinaryTip",
                            },
                        ]}
                        showUserProfile={false}
                    />
                )}
            </Modal>
            <CustomModal visible={postSettingOpen} onDismiss={hidePostSetting}>
                <PostSettingMenu
                    onEditPost={handleEditPost}
                    onDeletePost={handleDeletePost}
                />
            </CustomModal>
        </View>
    );
};

export default memo(CreatedPosts);

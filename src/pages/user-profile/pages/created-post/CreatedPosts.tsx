import { useUserRecipes, useUserTips } from "@/api/profile/ProfileApi";
import React, {
    useEffect,
    useState,
    type ReactElement,
    useContext,
    useMemo,
} from "react";
import { Modal, View, Pressable, Text } from "react-native";
import InfiniteScroll from "@/pages/reel/components/InfiniteScroll";
import type Post from "@/pages/reel/types/Post";
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
import moment from "moment";
import { getRecipeTime } from "@/pages/create-post/create-recipe/types/RecipeTime";
import CreatedPostList from "./components/CreatedPostList";
import EmptyCreatedPost from "./components/EmptyCreatedPost";
import type PostResponse from "@/api/post/types/PostResponse";
import { type Undefinable } from "@/types/app";
import { type RecipeResponse } from "@/api/post/types/PostResponse";

type ViewCategory = "recipe" | "tips";

const CreatedPosts = (): ReactElement => {
    const {
        getNext: getNextRecipes,
        recipes,
        ended: recipesEnded,
    } = useUserRecipes();
    const { getNext: getNextTips, tips, ended: tipsEnded } = useUserTips();

    const userProfileContext = useContext(UserProfileContext);

    const [viewingItem, setViewingItem] = useState(false);
    const [viewItem, setViewItem] =
        useState<Undefinable<PostResponse>>(undefined);

    const [viewCategory, setViewCategory] = useState<ViewCategory>("recipe");
    const [fetching, setFetching] = useState(false);

    const recipesEmpty = useMemo(() => recipes.length === 0, [recipes]);
    const tipsEmpty = useMemo(() => tips.length === 0, [tips]);

    useEffect(() => {
        if (viewCategory === "recipe") {
            void getNextRecipes();
        } else {
            void getNextTips();
        }
    }, []);

    const fetchMorePost = async (): Promise<void> => {
        if (
            (viewCategory === "recipe" && (recipesEmpty || recipesEnded)) ||
            (viewCategory === "tips" && (tipsEmpty || tipsEnded))
        ) {
            return;
        }

        setFetching(true);
        try {
            let success: boolean = false;
            if (viewCategory === "recipe") {
                success = await getNextRecipes();
            } else {
                success = await getNextTips();
            }

            if (!success) {
                // Alert user
            }
        } finally {
            setFetching(false);
        }
    };

    const postGetterProfile = async (index: number): Promise<Post | null> => {
        // Only allow viewing current item for now
        // TODO: Improve by adding option to navigate to a specific index in InfiniteScroll
        if (index !== 0) {
            return null;
        }

        if (viewItem === undefined) {
            return null;
        }

        const userInfo = userProfileContext.userInfo;
        if (userInfo == null) {
            return null;
        }

        const isRecipe = (item: PostResponse): item is RecipeResponse => {
            return "ingredients" in item;
        };

        if (viewCategory === "recipe" && isRecipe(viewItem)) {
            return {
                ...viewItem,
                type: "recipe",
                creator: userInfo,
                prepTime: getRecipeTime(moment.duration(viewItem.prepTime)),
                cookTime: getRecipeTime(moment.duration(viewItem.cookTime)),
            };
        }

        return {
            ...viewItem,
            type: "tip",
            creator: userInfo,
        };
    };

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

    if (userProfileContext.userInfo == null) {
        return <View></View>;
    }

    return (
        <View className="flex-1 bg-white">
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
                    data={recipes}
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
                    data={tips}
                    loading={fetching}
                    handleItemPress={handleItemPress}
                    handleOnEndReached={fetchMorePost}
                />
            )}
            {viewingItem && (
                <Modal animationType="slide">
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
                            <Pressable className="px-4 py-2 rounded-lg">
                                <IonIcon
                                    name="ios-ellipsis-vertical-sharp"
                                    size={18}
                                />
                            </Pressable>
                        </View>
                    </View>
                    <InfiniteScroll postGetter={postGetterProfile} />
                </Modal>
            )}
        </View>
    );
};

export default CreatedPosts;

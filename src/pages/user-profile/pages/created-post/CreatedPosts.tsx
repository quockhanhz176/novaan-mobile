import { useUserRecipes, useUserTips } from "@/api/profile/ProfileApi";
import React, {
    useEffect,
    useState,
    type ReactElement,
    useContext,
    useMemo,
    memo,
} from "react";
import { View } from "react-native";
import { PROFILE_EMPTY_RECIPE, PROFILE_EMPTY_TIPS } from "@/common/strings";
import { ToggleButton } from "react-native-paper";
import CustomToggleButton from "./components/CustomToggleButton";
import { UserProfileContext } from "../../UserProfile";
import CreatedPostList from "./components/CreatedPostList";
import EmptyCreatedPost from "./components/EmptyCreatedPost";
import { type Undefinable } from "@/types/app";
import { type MinimalPostInfo } from "@/api/profile/types";
import PostDetailModal from "./components/PostDetailModal";

type ViewCategory = "recipe" | "tips";

interface CreatedPostsProps {
    showStatus?: boolean;
}

const CreatedPosts = ({
    showStatus = true,
}: CreatedPostsProps): ReactElement<CreatedPostsProps> => {
    const { userInfo } = useContext(UserProfileContext);
    const {
        getNext: getNextRecipes,
        content: recipes,
        ended: recipesEnded,
    } = useUserRecipes(userInfo?.userId);

    const {
        getNext: getNextTips,
        content: tips,
        ended: tipsEnded,
    } = useUserTips(userInfo?.userId);

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
        useState<Undefinable<MinimalPostInfo>>(undefined);

    const [viewCategory, setViewCategory] = useState<ViewCategory>("recipe");
    const [fetching, setFetching] = useState(false);

    const recipesEmpty = useMemo(() => recipes.length === 0, [recipes]);
    const tipsEmpty = useMemo(() => tips.length === 0, [tips]);

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

    const handleItemPress = (item: MinimalPostInfo): void => {
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

    if (userInfo == null) {
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
            <PostDetailModal
                visible={viewingItem}
                onDimiss={handleCloseItemView}
                viewItem={viewItem}
                showSetting
            />
        </View>
    );
};

export default memo(CreatedPosts);

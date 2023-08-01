/* eslint-disable @typescript-eslint/no-unused-vars */
import IconLabelButton from "@/common/components/IconLabelButton";
import { customColors } from "@root/tailwind.config";
import {
    useState,
    type FC,
    useEffect,
    useCallback,
    useMemo,
    useReducer,
    memo,
} from "react";
import React, {
    Modal,
    TextInput,
    View,
    Text,
    type ViewStyle,
    type StyleProp,
    SafeAreaView,
} from "react-native";
import IconEvil from "react-native-vector-icons/EvilIcons";
import CreatedPostList from "../../../user-profile/pages/created-post/components/CreatedPostList";
import type PostResponse from "@/api/post/types/PostResponse";
import searchServices from "../../services/searchServices";
import useModalHook from "@/common/components/ModalHook";
import Filter from "./Filter";
import { type Route, TabBar, TabView } from "react-native-tab-view";
import { POST_TYPE_RECIPE, POST_TYPE_TIP } from "@/common/strings";
import { type PostType } from "@/api/post/types/PostResponse";
import { suiteReducer } from "./filterReducer";
import { type ReelParams } from "../../Search";
import { getRequestPostType } from "@/api/post/types/RequestPostType";
import LinearGradient from "react-native-linear-gradient";

const routes: Route[] = [
    {
        key: "recipe",
        title: POST_TYPE_RECIPE,
    },
    { key: "tip", title: POST_TYPE_TIP },
];

interface RecipeTipSearchParams {
    setReelParams?: (value: ReelParams) => void;
    showReel?: () => void;
}

const RecipeTipSearch: FC<RecipeTipSearchParams> = ({
    setReelParams,
    showReel,
}) => {
    const [searchString, setSearchString] = useState("");
    const [recipeResults, setRecipeResults] = useState<PostResponse[]>([]);
    const [tipResults, setTipResults] = useState<PostResponse[]>([]);
    const [preferenceSuite, dispatchSuite] = useReducer(
        suiteReducer,
        undefined
    );
    const [filterVisible, hideFilter, showFilter] = useModalHook();
    const [tabIndex, setTabIndex] = useState(0);
    const [recipesLoading, setRecipesLoading] = useState(false);
    const [tipsLoading, setTipsLoading] = useState(false);
    // const [reelInitialIndex, setReelInitialIndex] = useState(0);
    useEffect(() => {
        void searchServices.getPreferences().then((suite) => {
            if (suite == null) {
                return;
            }
            dispatchSuite({ type: "new_value", value: suite });
        });
    }, []);

    const getCurrentPostType = (): PostType => {
        if (routes[tabIndex].key === "recipe") {
            return "recipe";
        }

        return "tip";
    };

    const setResults = (results: PostResponse[], postType: PostType): void => {
        if (postType === "recipe") {
            setRecipeResults(results);
            return;
        }
        setTipResults(results);
    };

    const search = async (postType: PostType): Promise<void> => {
        if (searchString === "") {
            setResults([], postType);
            return;
        }

        const setLoading =
            postType === "recipe" ? setRecipesLoading : setTipsLoading;
        setLoading(true);
        const result = await searchServices.searchPost(searchString);
        setResults(result ?? [], postType);
        setLoading(false);
    };

    const clear = (): void => {
        setSearchString("");
        setResults([], getCurrentPostType());
    };

    const onSubmitEditing = (): void => {
        void search(getCurrentPostType());
    };

    const onTabChange = (value: number): void => {
        setTabIndex(value);
        if (routes[value].key === "recipe") {
            void search("recipe");
            return;
        }
        void search("tip");
    };

    // const reelPostGetter = useCallback(
    //     async (index: number): Promise<Post | null> => {
    //         const list =
    //             getCurrentPostType() === "recipe" ? recipeResults : tipResults;
    //         if (index !== reelInitialIndex || index > list.length - 1) {
    //             return null;
    //         }
    //         return await reelServices.toPost(list[index]);
    //     },
    //     [recipeResults, tipResults, reelInitialIndex]
    // );

    const itemPressed = useCallback(
        (item: PostResponse, index: number): void => {
            // setReelInitialIndex(index);
            setReelParams?.({
                minimalPosts: [
                    {
                        postId: item.id,
                        postType: getRequestPostType(item.type),
                    },
                ],
            });
            showReel?.();
        },
        []
    );

    const onEndReached = useCallback(() => {}, []);

    const resultContentContainerStyle = useMemo(
        (): StyleProp<ViewStyle> => ({
            paddingBottom: 100,
            paddingTop: 0,
            marginTop: 0,
        }),
        []
    );

    const renderResults = (type: PostType): JSX.Element => {
        const results = type === "recipe" ? recipeResults : tipResults;
        const loading = type === "recipe" ? recipesLoading : tipsLoading;
        return (
            <View className="mt-4">
                {results.length > 0 && (
                    <CreatedPostList
                        data={results}
                        hidden={false}
                        loading={loading}
                        handleOnEndReached={onEndReached}
                        handleItemPress={itemPressed}
                        contentContainerStyle={resultContentContainerStyle}
                    />
                )}
            </View>
        );
    };

    return (
        <>
            <View className=" bg-white flex-1">
                <View className="p-3 pb-0 flex-row space-x-3 items-center mt-1">
                    <View
                        className="rounded-xl overflow-hidden border-cgrey-platinum p-2 flex-row flex-1 items-center h-[50] space-x-2"
                        style={{ borderWidth: 1 }}
                    >
                        <IconEvil
                            name="search"
                            size={30}
                            color={customColors.cgrey.dim}
                        />
                        <TextInput
                            className="flex-1"
                            returnKeyType="search"
                            onChangeText={setSearchString}
                            value={searchString}
                            onSubmitEditing={onSubmitEditing}
                        ></TextInput>
                        {searchString !== "" && (
                            <IconLabelButton
                                iconPack="Ant"
                                iconProps={{
                                    name: "close",
                                    size: 20,
                                    color: customColors.cgrey.dim,
                                    onPress: clear,
                                }}
                            />
                        )}
                    </View>
                    <IconLabelButton
                        iconPack="FA5"
                        iconProps={{
                            name: "sliders-h",
                            size: 25,
                            color: customColors.cprimary["200"],
                        }}
                        buttonClassName="space-x-0 px-1"
                        buttonProps={{
                            onPress: showFilter,
                        }}
                    />
                </View>
                <TabView
                    className="flex-1 mt-1"
                    navigationState={{ index: tabIndex, routes }}
                    renderScene={(prop) => {
                        return renderResults(
                            prop.route.key === "recipe" ? "recipe" : "tip"
                        );
                    }}
                    onIndexChange={onTabChange}
                    renderTabBar={(tabBarProp) => (
                        <TabBar
                            scrollEnabled={false}
                            {...tabBarProp}
                            style={{}}
                            indicatorContainerStyle={{
                                backgroundColor: customColors.white,
                            }}
                            indicatorStyle={{
                                backgroundColor: customColors.cprimary["200"],
                            }}
                            renderLabel={(prop) => (
                                <Text
                                    className={
                                        "text-base " +
                                        (prop.focused
                                            ? "text-cprimary-200"
                                            : "text-cgrey-dim")
                                    }
                                >
                                    {prop.route.title}
                                </Text>
                            )}
                        />
                    )}
                />
            </View>
            <Modal
                onDismiss={hideFilter}
                visible={filterVisible}
                onRequestClose={hideFilter}
                animationType="slide"
            >
                {preferenceSuite != null && (
                    <Filter
                        suite={preferenceSuite}
                        dispatchSuite={dispatchSuite}
                        hideModal={hideFilter}
                    />
                )}
            </Modal>
        </>
    );
};

export default memo(RecipeTipSearch);

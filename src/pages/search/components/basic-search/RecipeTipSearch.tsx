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
    useRef,
} from "react";
import React, {
    Modal,
    TextInput,
    View,
    Text,
    type ViewStyle,
    type StyleProp,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import IconEvil from "react-native-vector-icons/EvilIcons";
import CreatedPostList from "../../../user-profile/pages/created-post/components/CreatedPostList";
import searchServices from "../../services/searchServices";
import useBooleanHook from "@/common/components/BooleanHook";
import Filter from "./Filter";
import { type Route, TabBar, TabView } from "react-native-tab-view";
import {
    BASIC_SEARCH_ADVANCED_SEARCH_BUTTON,
    BASIC_SEARCH_NO_POST,
    BASIC_SEARCH_USER_SEARCH_BUTTON,
    POST_TYPE_RECIPE,
    POST_TYPE_TIP,
} from "@/common/strings";
import { type PostType } from "@/api/post/types/PostResponse";
import { suiteReducer } from "./filterReducer";
import { type ReelParams } from "../../Search";
import { getRequestPostType } from "@/api/post/types/RequestPostType";
import { type MinimalPostInfo } from "@/api/profile/types";
import OverlayLoading from "@/common/components/OverlayLoading";
import AutoComplete from "../Autocomplete";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import IconFA5 from "react-native-vector-icons/FontAwesome5";

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
    showAdvancedSearch?: () => void;
    showUserSearch?: () => void;
}

const RecipeTipSearch: FC<RecipeTipSearchParams> = ({
    setReelParams,
    showReel,
    showAdvancedSearch,
    showUserSearch,
}) => {
    const [searchString, setSearchString] = useState("");
    const [recipeResults, setRecipeResults] = useState<MinimalPostInfo[]>();
    const [tipResults, setTipResults] = useState<MinimalPostInfo[]>();
    const [preferenceSuite, dispatchSuite] = useReducer(
        suiteReducer,
        undefined
    );
    const [filterVisible, hideFilter, showFilter] = useBooleanHook();
    const [tabIndex, setTabIndex] = useState(0);
    const [recipesLoading, setRecipesLoading] = useState(false);
    const [tipsLoading, setTipsLoading] = useState(false);
    const searchBarRef = useRef<View>(null);
    const [inputFocus, setInputFocusFalse, setInputFocusTrue] = useBooleanHook();
    const inputRef = useRef<TextInput>(null);
    // const [reelInitialIndex, setReelInitialIndex] = useState(0);

    useEffect(() => {
        const keyboardDidHideSubscription = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                inputRef.current?.blur();
            }
        );

        return () => {
            keyboardDidHideSubscription?.remove();
        };
    }, []);

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

    const setResults = (
        results: MinimalPostInfo[] | undefined,
        postType: PostType
    ): void => {
        if (postType === "recipe") {
            setRecipeResults(results);
            return;
        }
        setTipResults(results);
    };

    const search = async (postType: PostType): Promise<void> => {
        if (searchString === "") {
            setResults(undefined, postType);
            return;
        }

        const setLoading =
            postType === "recipe" ? setRecipesLoading : setTipsLoading;
        setLoading(true);
        const result = await searchServices.searchPost(
            searchString,
            postType,
            preferenceSuite
        );
        setResults(result ?? [], postType);
        setLoading(false);
    };

    const clear = (): void => {
        setSearchString("");
        setResults(undefined, getCurrentPostType());
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
        (item: MinimalPostInfo, index: number): void => {
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
            paddingTop: 16,
            marginTop: 0,
        }),
        []
    );

    const renderResults = (type: PostType): JSX.Element => {
        const results = type === "recipe" ? recipeResults : tipResults;
        const loading = type === "recipe" ? recipesLoading : tipsLoading;
        return (
            <View className="h-full w-full">
                {(() => {
                    if (loading) return <OverlayLoading />;

                    if (results == null) return;

                    if (results.length > 0)
                        return (
                            <CreatedPostList
                                data={results}
                                hidden={false}
                                loading={false}
                                handleOnEndReached={onEndReached}
                                handleItemPress={itemPressed}
                                contentContainerStyle={
                                    resultContentContainerStyle
                                }
                            />
                        );

                    return (
                        <View className="flex-1 justify-center items-center">
                            <Text>{BASIC_SEARCH_NO_POST}</Text>
                        </View>
                    );
                })()}
            </View>
        );
    };

    return (
        <>
            <View className=" bg-white flex-1">
                <View className="p-3 pb-0 flex-row space-x-3 items-center mt-1">
                    <View
                        className="rounded-xl overflow-hidden border-cgrey-platinum p-2
                        flex-row flex-1 items-center h-[50] space-x-2 border"
                        ref={searchBarRef}
                    >
                        <IconEvil
                            name="search"
                            size={30}
                            color={customColors.cgrey.dim}
                        />
                        <TextInput
                            ref={inputRef}
                            onBlur={setInputFocusFalse}
                            onFocus={setInputFocusTrue}
                            className="flex-1 text-base"
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
            <AutoComplete searchBarRef={searchBarRef} showing={inputFocus}>
                <View className="rounded-xl border border-cgrey-platinum bg-white overflow-hidden mt-1 py-1">
                    <TouchableOpacity
                        className="px-4 py-2 flex-row items-center"
                        onPress={showAdvancedSearch}
                    >
                        <>
                            <IconCommunity
                                name="chef-hat"
                                size={15}
                                color={customColors.cgrey.dim}
                            />
                            <Text className="text-base ml-3 text-cgrey-dim">
                                {BASIC_SEARCH_ADVANCED_SEARCH_BUTTON}
                            </Text>
                        </>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="px-4 py-2 flex-row items-center"
                        onPress={showUserSearch}
                    >
                        <>
                            <IconFA5
                                name="search-plus"
                                size={15}
                                color={customColors.cgrey.dim}
                            />
                            <Text className="text-base ml-3 text-cgrey-dim">
                                {BASIC_SEARCH_USER_SEARCH_BUTTON}
                            </Text>
                        </>
                    </TouchableOpacity>
                </View>
            </AutoComplete>
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

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
    FlatList,
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
import usePagingHook from "@/common/components/PagingHook";
import type PreferenceSuite from "../../types/PreferenceSuite";
import type AutocompeletePostResponse from "@/api/search/types/AutocompletePostResponse";
import { debounce } from "lodash";
import AutoCompleteItem from "./AutocompleteItem";

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

interface SearchParams {
    searchString: string;
    preferenceSuite?: PreferenceSuite;
}

const SEARCH_BATCH_SIZE = 10;

const RecipeTipSearch: FC<RecipeTipSearchParams> = ({
    setReelParams,
    showReel,
    showAdvancedSearch,
    showUserSearch,
}) => {
    const [searchString, setSearchString] = useState("");
    const searchStringRef = useRef("");
    const [preferenceSuite, dispatchSuite] = useReducer(
        suiteReducer,
        undefined
    );

    const search = useCallback(
        async (
            postType: PostType,
            start: number,
            size: number,
            params?: SearchParams
        ): Promise<MinimalPostInfo[] | null> => {
            if (params == null || params.searchString === "") {
                return null;
            }

            const result = await searchServices.searchPost(
                params.searchString,
                postType,
                params.preferenceSuite,
                start,
                size
            );
            return result;
        },
        []
    );

    const searchRecipes = useCallback(
        async (start: number, size: number, params: SearchParams) =>
            await search("recipe", start, size, params),
        [search]
    );

    const searchTips = useCallback(
        async (start: number, size: number, params: SearchParams) =>
            await search("tip", start, size, params),
        [search]
    );

    const [
        recipeResults,
        getRecipesReset,
        getRecipes,
        resetRecipes,
        recipesLoading,
    ] = usePagingHook<MinimalPostInfo, SearchParams>(
        searchRecipes,
        SEARCH_BATCH_SIZE
    );
    const [tipResults, getTipsReset, getTips, resetTips, tipsLoading] =
        usePagingHook<MinimalPostInfo, SearchParams>(
            searchTips,
            SEARCH_BATCH_SIZE
        );
    const [filterVisible, hideFilter, showFilter] = useBooleanHook();
    const tabIndexRef = useRef(0);
    const searchBarRef = useRef<View>(null);
    const [inputFocus, setInputFocusFalse, setInputFocusTrue] =
        useBooleanHook();
    const inputRef = useRef<TextInput>(null);
    const [autocompletePosts, setAutocompletePosts] = useState<
        AutocompeletePostResponse[]
    >([]);

    useEffect(() => {
        // fetch preferences
        void searchServices.getPreferences().then((suite) => {
            if (suite == null) {
                return;
            }
            dispatchSuite({ type: "new_value", value: suite });
        });

        // setup input
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

    const getCurrentPostType = (): PostType => {
        return routes[tabIndexRef.current].key === "recipe" ? "recipe" : "tip";
    };

    const clear = (): void => {
        setSearchString("");
        searchStringRef.current = "";
        setAutocompletePosts([]);
        const reset =
            getCurrentPostType() === "recipe" ? resetRecipes : resetTips;
        reset();
    };

    const onSubmitEditing = (): void => {
        const getReset =
            getCurrentPostType() === "recipe" ? getRecipesReset : getTipsReset;
        void getReset({ searchString, preferenceSuite });
    };

    const onTabChange = (value: number): void => {
        tabIndexRef.current = value;
        const getReset =
            routes[value].key === "recipe" ? getRecipesReset : getTipsReset;
        void getReset({ searchString, preferenceSuite });
    };

    const itemPressed = useCallback((item: MinimalPostInfo): void => {
        setReelParams?.({
            minimalPosts: [
                {
                    postId: item.id,
                    postType: getRequestPostType(item.type),
                },
            ],
        });
        showReel?.();
    }, []);

    const resultContentContainerStyle = useMemo(
        (): StyleProp<ViewStyle> => ({
            paddingBottom: 100,
            paddingTop: 16,
            marginTop: 0,
        }),
        []
    );

    const renderResults = (type: PostType): JSX.Element => {
        const [results, loading, getNext] =
            type === "recipe"
                ? [recipeResults, recipesLoading, getRecipes]
                : [tipResults, tipsLoading, getTips];

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
                                handleOnEndReached={getNext}
                                handleItemPress={itemPressed}
                                contentContainerStyle={
                                    resultContentContainerStyle
                                }
                                showStatus={false}
                            />
                        );

                    return (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-cgrey-battleship">
                                {BASIC_SEARCH_NO_POST}
                            </Text>
                        </View>
                    );
                })()}
            </View>
        );
    };

    const autocomplete = useCallback(
        debounce(async (value: string) => {
            if (searchStringRef.current === "") {
                setAutocompletePosts([]);
                return;
            }
            if (value !== searchStringRef.current) {
                return;
            }

            const result = await searchServices.autocompleteBasicSearch(value);
            if (result != null && value === searchStringRef.current) {
                setAutocompletePosts(result);
            }
        }, 100),
        []
    );

    const onTextChange = useCallback(async (value: string) => {
        setSearchString(value);
        searchStringRef.current = value;
        if (value === "") {
            setAutocompletePosts([]);
            return;
        }

        void autocomplete(value);
    }, []);

    const onAutoCompleteItemPress = useCallback(
        async (item: AutocompeletePostResponse) => {
            setReelParams?.({
                minimalPosts: [
                    {
                        postId: item.id,
                        postType: item.type,
                    },
                ],
            });
            showReel?.();
        },
        []
    );

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
                            onChangeText={onTextChange}
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
                    navigationState={{ index: tabIndexRef.current, routes }}
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
                <View className="rounded-xl border border-cgrey-platinum bg-white overflow-hidden mt-1 max-h-[320]">
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={autocompletePosts}
                        renderItem={({ item }) => (
                            <AutoCompleteItem
                                item={item}
                                onItemPressed={onAutoCompleteItemPress}
                            />
                        )}
                        ListHeaderComponent={<View className="h-1" />}
                        ListFooterComponent={
                            <>
                                <TouchableOpacity
                                    className="px-4 py-2 flex-row items-center"
                                    onPress={showAdvancedSearch}
                                >
                                    <>
                                        <IconFA5
                                            name="search-plus"
                                            size={15}
                                            color={customColors.cgrey.dim}
                                        />
                                        <Text className="text-base ml-3 text-cgrey-dim">
                                            {
                                                BASIC_SEARCH_ADVANCED_SEARCH_BUTTON
                                            }
                                        </Text>
                                    </>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="px-4 py-2 flex-row items-center"
                                    onPress={showUserSearch}
                                >
                                    <>
                                        <IconCommunity
                                            name="chef-hat"
                                            size={15}
                                            color={customColors.cgrey.dim}
                                        />
                                        <Text className="text-base ml-3 text-cgrey-dim">
                                            {BASIC_SEARCH_USER_SEARCH_BUTTON}
                                        </Text>
                                    </>
                                </TouchableOpacity>
                                <View className="h-1" />
                            </>
                        }
                    />
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

import IconLabelButton from "@/common/components/IconLabelButton";
import { customColors } from "@root/tailwind.config";
import React, {
    useState,
    type FC,
    useReducer,
    useCallback,
    useRef,
    memo,
} from "react";
import {
    TextInput,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import IngredientItem from "./IngredientItem";
import ingredientsReducer from "./ingredientsReducer";
import CreatedPostList from "@/pages/user-profile/pages/created-post/components/CreatedPostList";
import { type ReelParams } from "../../Search";
import searchServices from "../../services/searchServices";
import { type RecipeResponse } from "@/api/post/types/PostResponse";
import type PostResponse from "@/api/post/types/PostResponse";
import { getRequestPostType } from "@/api/post/types/RequestPostType";
import LinearGradient from "react-native-linear-gradient";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import SuggestedIngredientItem from "./SuggestedIngredientItem";
import {
    ADVANCED_SEARCH_BRIEF_1,
    ADVANCED_SEARCH_BRIEF_2,
    ADVANCED_SEARCH_NO_POST,
    ADVANCED_SEARCH_SUGGESTION_EMPTY,
    ADVANCED_SEARCH_TITLE,
} from "@/common/strings";
import OverlayLoading from "@/common/components/OverlayLoading";
import AutoComplete from "../Autocomplete";
import usePagingHook from "@/common/components/PagingHook";
import type PreferenceSuite from "../../types/PreferenceSuite";

interface AdvancedSearchParams {
    setReelParams?: (value: ReelParams) => void;
    showReel?: () => void;
    navigateBack?: () => void;
}

interface SearchParams {
    ingredients?: string[];
    preferenceSuite?: PreferenceSuite;
}

const styles = StyleSheet.create({
    createdPostList: {
        paddingBottom: 100,
        paddingTop: 10,
        marginTop: 0,
    },
});

const SEARCH_BATCH_SIZE = 10000;

const AdvancedSearch: FC<AdvancedSearchParams> = ({
    setReelParams,
    showReel,
    navigateBack,
}) => {
    const [ingredients, dispatchIngredients] = useReducer(
        ingredientsReducer,
        new Set<string>([
            "thịt bò tươi",
            "rượu vang đỏ",
            "quả gấc",
            "cà rốt",
            "gừng",
        ])
    );
    const [ingredientString, setIngredientString] = useState("");

    const fetchData = useCallback(
        async (
            start: number,
            size: number,
            params: SearchParams
        ): Promise<RecipeResponse[] | null> => {
            if (params.ingredients == null) {
                return null;
            }

            const results = await searchServices.searchAdvanced(
                params.ingredients,
                start,
                size
            );
            return results;
        },
        [ingredients]
    );

    const [searchResults, fetchNextReset, , resetResults, searchLoading] =
        usePagingHook<RecipeResponse, SearchParams>(
            fetchData,
            SEARCH_BATCH_SIZE,
            1
        );
    const inputWrapperRef = useRef<View>(null);
    const [suggestedIngredients, setSuggestedIngredients] =
        useState<string[]>();

    const onResetPressed = useCallback((): void => {
        dispatchIngredients({ type: "reset" });
        resetResults();
    }, []);

    const onDeletePressed = useCallback(
        (value: string): void => {
            dispatchIngredients({ type: "remove", value });
        },
        [dispatchIngredients]
    );

    const renderIngredient: FC = useCallback(
        (value: string) => {
            return (
                <IngredientItem
                    name={value}
                    key={value}
                    onDelete={onDeletePressed}
                />
            );
        },
        [onDeletePressed]
    );

    const searchResultItem = useCallback(
        (item: PostResponse, _index: number): void => {
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

    const clearSearchString = useCallback(() => {
        setIngredientString("");
        setSuggestedIngredients(undefined);
    }, []);

    const loadSuggestions = useCallback(async (keyword: string) => {
        const result = await searchServices.getIngredients(keyword);
        if (result == null) {
            return;
        }

        setSuggestedIngredients(result);
    }, []);

    const onTextChange = useCallback((value: string): void => {
        setIngredientString(value);
        if (value === "") {
            clearSearchString();
            return;
        }

        void loadSuggestions(value);
    }, []);

    const onSuggestedIngredientPress = useCallback((value: string): void => {
        if (value === "") {
            return;
        }

        dispatchIngredients({ type: "add", value });
        clearSearchString();
    }, []);

    const renderSuggestedIngredients = useCallback(
        ({ item }: { item: string }) => (
            <SuggestedIngredientItem
                value={item}
                onItemPressed={onSuggestedIngredientPress}
            />
        ),
        []
    );

    const onEndReach = useCallback(() => {}, []);

    const onSearch = (): void => {
        void fetchNextReset({
            ingredients:
                ingredients != null ? Array.from(ingredients) : undefined,
        });
    };

    return (
        <View className="flex-1 bg-white">
            <View className="h-[55] flex-row px-1 items-center border-cgrey-platinum p-3">
                <TouchableOpacity
                    onPress={navigateBack}
                    activeOpacity={0.2}
                    className="h-10 w-10 items-center justify-center"
                >
                    <IconMaterial name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-medium">
                    {ADVANCED_SEARCH_TITLE}
                </Text>
            </View>
            <View className="flex-1">
                <View className="w-full flex-row items-center px-3">
                    <View
                        ref={inputWrapperRef}
                        className="rounded-xl border border-cgrey-platinum pl-2 pr-2
                        flex-row flex-1 items-center h-[44] space-x-2 mr-2"
                    >
                        <TextInput
                            autoCapitalize="none"
                            className="flex-1 px-1 text-base"
                            returnKeyType="go"
                            onChangeText={onTextChange}
                            value={ingredientString}
                        />
                        {ingredientString !== "" && (
                            <IconLabelButton
                                iconPack="Ionicons"
                                iconProps={{
                                    name: "close",
                                    size: 20,
                                    color: customColors.cgrey.dim,
                                }}
                                buttonProps={{
                                    onPress: clearSearchString,
                                }}
                                buttonClassName="p-[2] space-x-0"
                            />
                        )}
                    </View>
                    <IconLabelButton
                        iconPack="Ionicons"
                        iconProps={{
                            name: "search",
                            size: 25,
                            color: customColors.cprimary["300"],
                        }}
                        buttonClassName="space-x-0 px-1"
                        buttonProps={{
                            onPress: onSearch,
                        }}
                    />
                    <IconLabelButton
                        iconPack="Community"
                        iconProps={{
                            name: "delete-empty-outline",
                            size: 30,
                            color: customColors.cprimary["300"],
                        }}
                        buttonClassName="space-x-0 px-1"
                        buttonProps={{
                            onPress: onResetPressed,
                        }}
                    />
                </View>
                <View className="max-h-[108] my-3 px-3">
                    <ScrollView>
                        <View className="flex-row flex-wrap">
                            {ingredients != null &&
                                Array.from(ingredients).map(renderIngredient)}
                        </View>
                    </ScrollView>
                </View>
                <View className="flex-1 px-2">
                    <LinearGradient
                        colors={["#bbbbbb88", "#bbbbbb22", "#00000000"]}
                        className="h-1 left-0 right-0"
                        style={{
                            position: "absolute",
                            top: 0,
                        }}
                    />
                    {searchLoading ? (
                        <OverlayLoading />
                    ) : searchResults != null ? (
                        searchResults.length > 0 ? (
                            <CreatedPostList
                                data={searchResults}
                                hidden={false}
                                loading={false}
                                handleOnEndReached={onEndReach}
                                handleItemPress={searchResultItem}
                                contentContainerStyle={styles.createdPostList}
                                showStatus={false}
                            />
                        ) : (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-cgrey-battleship">
                                    {ADVANCED_SEARCH_NO_POST}
                                </Text>
                            </View>
                        )
                    ) : (
                        <View className="flex-1 px-10 justify-center items-center">
                            <IconFA5
                                name="search-plus"
                                color={customColors.cgrey.battleship}
                                size={100}
                            />
                            <Text className="text-cgrey-battleship mt-5 text-base text-center">
                                {ADVANCED_SEARCH_BRIEF_1}
                                <IconFA5
                                    name="search"
                                    color={customColors.cgrey.battleship}
                                />
                                {ADVANCED_SEARCH_BRIEF_2}
                            </Text>
                        </View>
                    )}
                    {searchLoading && <OverlayLoading />}
                </View>
            </View>
            <AutoComplete
                searchBarRef={inputWrapperRef}
                showing={suggestedIngredients != null}
            >
                <View className="w-full rounded-xl border border-cgrey-platinum bg-white overflow-hidden mt-1">
                    {suggestedIngredients != null &&
                    suggestedIngredients.length > 0 ? (
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            data={suggestedIngredients}
                            renderItem={renderSuggestedIngredients}
                        ></FlatList>
                    ) : (
                        <View className="flex-1 px-2 py-3">
                            <Text className="text-cgrey-battleship">
                                {ADVANCED_SEARCH_SUGGESTION_EMPTY}
                            </Text>
                        </View>
                    )}
                </View>
            </AutoComplete>
        </View>
    );
};

export default memo(AdvancedSearch);

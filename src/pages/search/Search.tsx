import React, { useState, type FC } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import useBooleanHook from "@/common/components/BooleanHook";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import InfiniteScroll from "@/pages/reel/InfiniteScrollv2";
import { SEARCH_POST_DETAILS_TITLE } from "@/common/strings";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import AdvancedSearch from "./components/advanced-search/AdvancedSearch";
import RecipeTipSearch from "./components/basic-search/RecipeTipSearch";
import UserSearch from "./components/user-search/UserSearch";

import { type BottomTabParamList } from "@/types/navigation";
import { type BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export interface ReelParams {
    minimalPosts: MinimalPost[];
}

export interface SearchRouteProps {
    advancedSearchShown?: boolean;
}

type SearchProps = BottomTabScreenProps<BottomTabParamList, "Search">;

const Search: FC<SearchProps> = ({ route, navigation }) => {
    const advancedSearchShown = route.params?.advancedSearchShown;
    if (advancedSearchShown === true) {
        navigation.setParams({ advancedSearchShown: false });
    }

    console.log("render");

    const [advancedSearchVisible, hideAdvancedSearch, showAdvancedSearch] =
        useBooleanHook(undefined, advancedSearchShown);
    const [userSearchVisible, hideUserSearch, showUserSearch] =
        useBooleanHook();
    const [reelVisible, hideReel, showReel] = useBooleanHook();
    const [reelParams, setReelParams] = useState<ReelParams>({
        minimalPosts: [],
    });

    return (
        <>
            <RecipeTipSearch
                showReel={showReel}
                setReelParams={setReelParams}
                showAdvancedSearch={showAdvancedSearch}
                showUserSearch={showUserSearch}
            />
            <Modal
                animationType="slide"
                visible={reelVisible}
                onRequestClose={hideReel}
                onDismiss={hideReel}
            >
                <View
                    style={{ height: 50 }}
                    className="flex-row justify-between items-center"
                >
                    <TouchableOpacity
                        onPress={hideReel}
                        className="px-4 py-2 rounded-lg"
                    >
                        <IconMaterial name="arrow-back" size={24} />
                    </TouchableOpacity>
                    <View className="flex-1 items-center mr-12">
                        <Text className="text-base font-semibold">
                            {SEARCH_POST_DETAILS_TITLE}
                        </Text>
                    </View>
                </View>
                {reelParams != null && (
                    <InfiniteScroll postIds={reelParams.minimalPosts} />
                )}
            </Modal>
            <Modal
                animationType="slide"
                visible={advancedSearchVisible}
                onRequestClose={hideAdvancedSearch}
                onDismiss={hideAdvancedSearch}
            >
                <AdvancedSearch
                    showReel={showReel}
                    setReelParams={setReelParams}
                    navigateBack={hideAdvancedSearch}
                />
            </Modal>
            <Modal
                animationType="slide"
                visible={userSearchVisible}
                onRequestClose={hideUserSearch}
                onDismiss={hideUserSearch}
            >
                <UserSearch navigateBack={hideUserSearch} />
            </Modal>
        </>
    );
};

export default Search;

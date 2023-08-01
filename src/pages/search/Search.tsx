import React, { useState, type FC } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import useModalHook from "@/common/components/ModalHook";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import InfiniteScroll from "@/pages/reel/InfiniteScrollv2";
import { SEARCH_POST_DETAILS_TITLE } from "@/common/strings";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import SearchSwiper from "./components/SearchSwiper";

export interface ReelParams {
    minimalPosts: MinimalPost[];
}

const Search: FC = () => {
    const [reelVisible, hideReel, showReel] = useModalHook();
    const [reelParams, setReelParams] = useState<ReelParams>({
        minimalPosts: [],
    });

    return (
        <>
            <View className="flex-1">
                <SearchSwiper
                    setReelParams={setReelParams}
                    showReel={showReel}
                />
            </View>
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
        </>
    );
};

export default Search;

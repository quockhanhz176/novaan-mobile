// Why I need a different FlatList (from react-native-gesture-handler, not react-native)
// https://stackoverflow.com/questions/60498103/nested-flatlist-with-the-same-scroll-direction-not-scrolling
// https://github.com/facebook/react-native/issues/15375
import React, { type ReactElement } from "react";
import { FlatList } from "react-native-gesture-handler";
import CreatedPostItem from "./CreatedPostItem";
import type PostResponse from "@/api/post/types/PostResponse";
import { uuidv4 } from "react-native-compressor";

interface CreatedPostListProps {
    data: PostResponse[];
    hidden: boolean;
    handleItemPress: (item: PostResponse) => void;
    handleOnEndReached: () => void;
    loading: boolean;
}

const CreatedPostList = ({
    data,
    hidden,
    loading,
    handleItemPress,
    handleOnEndReached,
}: CreatedPostListProps): ReactElement<CreatedPostListProps> => {
    // Generate listKey to avoid nested FlatList error
    const uniqueListKey = uuidv4();

    // Render as hidden when needed to avoid rendering the whole list again
    return (
        <FlatList
            key={uniqueListKey}
            style={{ display: hidden ? "none" : "flex" }}
            data={data}
            className="w-full"
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ marginTop: 8 }}
            renderItem={({ item }) => (
                <CreatedPostItem
                    item={item}
                    onItemPress={() => {
                        handleItemPress(item);
                    }}
                />
            )}
            onEndReached={handleOnEndReached}
            onEndReachedThreshold={1}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default CreatedPostList;

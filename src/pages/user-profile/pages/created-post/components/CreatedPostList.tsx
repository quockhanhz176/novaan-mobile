import React, { type ReactElement } from "react";
import { FlatList } from "react-native";
import CreatedPostItem from "./CreatedPostItem";
import type PostResponse from "@/api/post/types/PostResponse";

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
    // Render as hidden when needed to avoid rendering the whole list again
    return (
        <FlatList
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

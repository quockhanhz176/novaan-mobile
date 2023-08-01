// Why I need a different FlatList (from react-native-gesture-handler, not react-native)
// https://stackoverflow.com/questions/60498103/nested-flatlist-with-the-same-scroll-direction-not-scrolling
// https://github.com/facebook/react-native/issues/15375
import React, { memo, type ReactElement } from "react";
import { FlatList } from "react-native-gesture-handler";
import CreatedPostItem from "./CreatedPostItem";
import { uuidv4 } from "react-native-compressor";
import { type StyleProp, type ViewStyle } from "react-native";
import { type MinimalPostInfo } from "@/api/profile/types";

interface CreatedPostListProps {
    data: MinimalPostInfo[];
    hidden: boolean;
    handleItemPress: (item: MinimalPostInfo, index: number) => void;
    handleOnEndReached: () => void;
    loading: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

const CreatedPostList = ({
    data,
    hidden,
    loading,
    handleItemPress,
    handleOnEndReached,
    contentContainerStyle,
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
            contentContainerStyle={[{ marginTop: 8 }, contentContainerStyle]}
            renderItem={({ item, index }) => (
                <CreatedPostItem
                    item={item}
                    onItemPress={() => {
                        handleItemPress(item, index);
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

export default memo(CreatedPostList);

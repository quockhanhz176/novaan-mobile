// Why I need a different FlatList (from react-native-gesture-handler, not react-native)
// https://stackoverflow.com/questions/60498103/nested-flatlist-with-the-same-scroll-direction-not-scrolling
// https://github.com/facebook/react-native/issues/15375
import React, { memo, useCallback, type ReactElement } from "react";
import { FlatList } from "react-native-gesture-handler";
import CreatedPostItem from "./CreatedPostItem";
import { type StyleProp, type ViewStyle } from "react-native";
import { type MinimalPostInfo } from "@/api/profile/types";
import { BOTTOM_NAV_HEIGHT } from "@/common/constants";

interface CreatedPostListProps {
    data: MinimalPostInfo[];
    hidden: boolean;
    handleItemPress: (item: MinimalPostInfo, index: number) => void;
    handleOnEndReached: () => void;
    loading?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

const CreatedPostList = ({
    data,
    hidden,
    loading = false,
    handleItemPress,
    handleOnEndReached,
    contentContainerStyle,
}: CreatedPostListProps): ReactElement<CreatedPostListProps> => {
    // Render as hidden when needed to avoid rendering the whole list again

    const renderItem = useCallback(
        ({ item, index }: { item: MinimalPostInfo; index: number }) => (
            <CreatedPostItem
                index={index}
                item={item}
                onItemPress={handleItemPress}
            />
        ),
        [data]
    );

    return (
        <FlatList
            style={{ display: hidden ? "none" : "flex" }}
            data={data}
            className="w-full"
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
                contentContainerStyle,
                { paddingBottom: BOTTOM_NAV_HEIGHT },
            ]}
            renderItem={renderItem}
            onEndReached={handleOnEndReached}
            onEndReachedThreshold={1}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default memo(CreatedPostList);

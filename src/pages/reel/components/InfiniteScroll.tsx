import React, { useState, type FC, useCallback, useEffect } from "react";
import ScrollItem, { type Page } from "./ScrollItem";
import { FlatList, SafeAreaView, useWindowDimensions } from "react-native";

const PRELOAD_AMOUNT = 5;
const END_REACH_THRESHOLD = 1;

const InfiniteScroll: FC = () => {
    const [pages, setPages] = useState<number[]>([]);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const dimension = useWindowDimensions();

    useEffect(() => {
        if (pages.length === 0) {
            fetchMoreData();
        }
    }, []);

    const fetchMoreData = (): void => {
        // When we need to init pages
        if (pages.length === 0) {
            setPages([...Array(5).keys()]);
            return;
        }

        // Fetch the next 5 post's id
        const lastId = pages[pages.length - 1];
        for (let i = 1; i <= PRELOAD_AMOUNT; i++) {
            pages.push(lastId + i);
        }

        setPages([...pages]);
    };

    const onScrollItemPageChange = useCallback((page: Page): void => {
        if (page === "Video") {
            setScrollEnabled(true);
        } else {
            setScrollEnabled(false);
        }
    }, []);

    if (pages.length === 0) {
        return null;
    }

    return (
        <SafeAreaView className="h-screen">
            <FlatList
                data={pages}
                keyExtractor={(item) => String(item)}
                scrollEnabled={scrollEnabled}
                pagingEnabled={true}
                renderItem={({ item }) => {
                    console.log(item);
                    return <ScrollItem onPageChange={onScrollItemPageChange} />;
                }}
                windowSize={dimension.height}
                onEndReachedThreshold={END_REACH_THRESHOLD}
                onEndReached={fetchMoreData}
                removeClippedSubviews={true}
                // We only view one item at a time, so we keep these number low to avoid blocking
                // https://reactnative.dev/docs/optimizing-flatlist-configuration
                maxToRenderPerBatch={2}
                initialNumToRender={2}
            />
        </SafeAreaView>
    );
};

export default InfiniteScroll;

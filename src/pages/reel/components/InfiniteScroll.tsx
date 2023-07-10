import React, {
    useState,
    type FC,
    useCallback,
    useRef,
    type ReactElement,
    useEffect,
} from "react";
import ScrollItem, { type Page } from "./ScrollItem";
import {
    FlatList,
    type LayoutChangeEvent,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    SafeAreaView,
} from "react-native";
import { SCROLL_ITEM_HEIGHT } from "../commons/constants";
import type Post from "../types/Post";
import reelServices from "../services/reelServices";

interface InfiniteScrollProps {
    postGetter?: (index: number) => Promise<Post | null>;
}

export type InternalPost = Post & {
    index: number;
};

const PRELOAD_AMOUNT = 2;
const END_REACH_THRESHOLD = 2;

const InfiniteScroll: FC<InfiniteScrollProps> = ({ postGetter }) => {
    const [loading, setLoading] = useState(false);

    const [internalPosts, setInternalPosts] = useState<InternalPost[]>([]);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const scrollHeight = useRef(1);

    useEffect(() => {
        void fetchPost(0, PRELOAD_AMOUNT);
    }, []);

    const fetchPostDefault = async (index: number): Promise<Post | null> => {
        return await reelServices.getPost(index);
    };

    const fetchPost = async (
        index: number,
        count: number = 1
    ): Promise<void> => {
        setLoading(true);
        try {
            if (postGetter == null) {
                postGetter = fetchPostDefault;
            }
            for (let i = 0; i < count; i++) {
                const post = await postGetter(index + i);
                if (post == null) {
                    continue;
                }
                internalPosts.push({ ...post, index: index + i });
            }

            setInternalPosts([...internalPosts]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreData = async (): Promise<void> => {
        if (internalPosts.length === 0) {
            return;
        }

        const lastIndex = internalPosts.length - 1;
        for (let i = 1; i <= PRELOAD_AMOUNT; i++) {
            const index = lastIndex + i;
            await fetchPost(index);
        }
    };

    const onScrollItemPageChange = useCallback((page: Page): void => {
        if (page === "Video") {
            setScrollEnabled(true);
        } else {
            setScrollEnabled(false);
        }
    }, []);

    const onMomentumScrollEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ): void => {
        const page = Math.round(
            e.nativeEvent.contentOffset.y / scrollHeight.current
        );
        setCurrentPage(page);
    };

    const onLayout = (e: LayoutChangeEvent): void => {
        scrollHeight.current = e.nativeEvent.layout.height;
    };

    const renderItem = ({ item }: { item: InternalPost }): ReactElement => {
        return (
            <ScrollItem
                post={item}
                onPageChange={onScrollItemPageChange}
                isVideoPaused={item.index !== currentPage}
            />
        );
    };

    return (
        <SafeAreaView style={{ height: SCROLL_ITEM_HEIGHT }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={internalPosts}
                onMomentumScrollEnd={onMomentumScrollEnd}
                scrollEnabled={scrollEnabled}
                pagingEnabled={true}
                renderItem={renderItem}
                onEndReachedThreshold={END_REACH_THRESHOLD}
                onEndReached={fetchMoreData}
                onLayout={onLayout}
            />
            {/* TODO: Add loading overlay for video here */}
            {loading && null}
        </SafeAreaView>
    );
};

export default InfiniteScroll;

import React, {
    useState,
    type FC,
    useCallback,
    useRef,
    type ReactElement,
    useEffect,
    memo,
} from "react";
import ScrollItem from "./components/scroll-items/ScrollItemv2";
import {
    FlatList,
    type LayoutChangeEvent,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    SafeAreaView,
} from "react-native";
import { SCROLL_ITEM_HEIGHT } from "./commons/constants";
import type Post from "./types/Post";
import { usePostList } from "@/api/post/PostApiHook";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import { type Page } from "./components/ScrollItem";
import OverlayLoading from "@/common/components/OverlayLoading";

interface InfiniteScrollProps {
    postIds?: MinimalPost[];
    showUserProfile?: boolean;
}

export type InternalPost = Post & {
    index: number;
};

const END_REACH_THRESHOLD = 1.1;

const InfiniteScroll: FC<InfiniteScrollProps> = ({
    postIds,
    showUserProfile = true,
}) => {
    const { postList, fetchPostList } = usePostList();

    const [renderPosts, setRenderPosts] = useState<MinimalPost[]>([]);

    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const scrollHeight = useRef(1);
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        if (postIds != null) {
            fetchPost(0);
            return;
        }
        void fetchPostList();
    }, []);

    useEffect(() => {
        if (postList.length === 0) {
            return;
        }

        // Init list of posts that need to be renders in the FlatList
        fetchPost(0, 2);
    }, [postList]);

    const fetchPost = (startIndex: number, count: number = 1): void => {
        const postIdsSource = postIds != null ? postIds : postList;
        if (startIndex >= postIdsSource.length) {
            return;
        }

        for (let i = 0; i < count; i++) {
            if (postIdsSource.length <= startIndex + i) {
                continue;
            }
            const postId = postIdsSource[startIndex + i];
            renderPosts.push(postId);
        }

        setRenderPosts([...renderPosts]);
    };

    const fetchNextData = async (): Promise<void> => {
        if (renderPosts.length === 0) {
            return;
        }
        fetchPost(renderPosts.length);
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

    const nextVideo = (): void => {
        if (postIds != null && currentPage + 1 >= postIds.length) {
            return;
        }

        if (currentPage + 1 >= postList.length) {
            return;
        }

        listRef.current?.scrollToIndex({
            animated: true,
            index: currentPage + 1,
        });
    };

    const renderItem = useCallback(
        ({
            item,
            index,
        }: {
            item: MinimalPost;
            index: number;
        }): ReactElement => {
            return (
                <ScrollItem
                    post={item}
                    showUserProfile={showUserProfile}
                    onPageChange={onScrollItemPageChange}
                    isVideoPaused={index !== currentPage}
                    nextVideo={nextVideo}
                />
            );
        },
        [currentPage]
    );

    if (renderPosts.length === 0) {
        return <OverlayLoading />;
    }

    return (
        <SafeAreaView style={{ height: SCROLL_ITEM_HEIGHT }}>
            <FlatList
                ref={listRef}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.postId}
                data={renderPosts}
                onMomentumScrollEnd={onMomentumScrollEnd}
                scrollEnabled={scrollEnabled}
                pagingEnabled={true}
                renderItem={renderItem}
                onEndReachedThreshold={END_REACH_THRESHOLD}
                onEndReached={fetchNextData}
                onLayout={onLayout}
                getItemLayout={(data, index) => ({
                    length: SCROLL_ITEM_HEIGHT,
                    offset: SCROLL_ITEM_HEIGHT * index,
                    index,
                })}
                // Test improvement
                maxToRenderPerBatch={2}
                updateCellsBatchingPeriod={1000}
            />
        </SafeAreaView>
    );
};

export default memo(InfiniteScroll);

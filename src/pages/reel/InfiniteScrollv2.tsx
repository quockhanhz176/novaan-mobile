import React, {
    useState,
    type FC,
    useCallback,
    useRef,
    useEffect,
    memo,
    useMemo,
} from "react";
import ScrollItem from "./components/scroll-items/ScrollItemv2";
import {
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
import {
    DataProvider,
    LayoutProvider,
    RecyclerListView,
    type WindowCorrection,
    type RecyclerListViewProps,
} from "recyclerlistview";
import { type RecyclerListViewState } from "recyclerlistview/dist/reactnative/core/RecyclerListView";
import { windowWidth } from "@/common/utils";

interface InfiniteScrollProps {
    postIds?: MinimalPost[];
    showUserProfile?: boolean;
}

export type InternalPost = Post & {
    index: number;
};

const END_REACH_THRESHOLD = 2;

const InfiniteScroll: FC<InfiniteScrollProps> = ({
    postIds,
    showUserProfile = true,
}) => {
    const { postList, fetchPostList } = usePostList();

    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const [dataProvider, setDataProvider] = useState(
        new DataProvider((r1: MinimalPost, r2: MinimalPost) => r1 !== r2)
    );

    const scrollHeight = useRef(1);
    const listRef =
        useRef<RecyclerListView<RecyclerListViewProps, RecyclerListViewState>>(
            null
        );

    useEffect(() => {
        if (postIds != null) {
            setDataProvider(dataProvider.cloneWithRows(postIds));
            return;
        }

        if (postList.length > 0) {
            return;
        }

        void fetchPostList();
    }, []);

    const fetchPost = (startIndex: number, count: number = 2): void => {
        const postIdsSource = postIds != null ? postIds : postList;
        if (startIndex >= postIdsSource.length) {
            return;
        }

        const newItems: MinimalPost[] = dataProvider.getAllData();
        for (let i = 0; i < count; i++) {
            if (postIdsSource.length <= startIndex + i) {
                continue;
            }
            const postId = postIdsSource[startIndex + i];
            newItems.push(postId);
        }

        setDataProvider(dataProvider.cloneWithRows([...newItems], startIndex));
    };

    useEffect(() => {
        if (postList.length === 0) {
            return;
        }

        console.log("Refreshing post list ?");

        fetchPost(0, 2);
    }, [postList]);

    const fetchNextData = async (): Promise<void> => {
        const currentSize = dataProvider.getSize();
        console.log(currentSize);

        if (currentSize === 0) {
            return;
        }

        fetchPost(currentSize);
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

    const nextVideo = (): void => {
        if (postIds != null && currentPage + 1 >= postIds.length) {
            return;
        }

        if (currentPage + 1 >= postList.length) {
            return;
        }

        listRef.current?.scrollToIndex(currentPage + 1, true);
    };

    // const renderItem = useCallback(
    //     ({
    //         item,
    //         index,
    //     }: {
    //         item: MinimalPost;
    //         index: number;
    //     }): ReactElement => {
    //         return (
    //             <ScrollItem
    //                 post={item}
    //                 showUserProfile={showUserProfile}
    //                 onPageChange={onScrollItemPageChange}
    //                 isVideoPaused={index !== currentPage}
    //                 nextVideo={nextVideo}
    //             />
    //         );
    //     },
    //     [currentPage]
    // );

    const layoutProvider = useMemo(
        () =>
            new LayoutProvider(
                () => 0,
                (type, dim, index) => {
                    dim.width = windowWidth;
                    dim.height = SCROLL_ITEM_HEIGHT;
                }
            ),
        []
    );

    const applyWindowCorrection = (
        offsetX: number,
        offsetY: number,
        windowCorrection: WindowCorrection
    ): void => {
        const currentOffset = currentPage * SCROLL_ITEM_HEIGHT;

        windowCorrection = {
            startCorrection: 0,
            endCorrection: 0,
            windowShift: offsetY - currentOffset,
        };
    };

    const renderRow = useCallback(
        (type: string | number, data: MinimalPost, index: number) => {
            return (
                <ScrollItem
                    key={data.postId}
                    post={data}
                    showUserProfile={showUserProfile}
                    onPageChange={onScrollItemPageChange}
                    isVideoPaused={index !== currentPage}
                    nextVideo={nextVideo}
                />
            );
        },
        [currentPage]
    );

    if (dataProvider.getSize() === 0) {
        return <OverlayLoading />;
    }

    return (
        <SafeAreaView style={{ height: SCROLL_ITEM_HEIGHT }}>
            <RecyclerListView
                ref={listRef}
                dataProvider={dataProvider}
                layoutProvider={layoutProvider}
                layoutSize={{
                    width: windowWidth,
                    height: SCROLL_ITEM_HEIGHT,
                }}
                rowRenderer={renderRow}
                // showsVerticalScrollIndicator={false}
                // keyExtractor={(item) => item.postId}
                // data={renderPosts}
                // onMomentumScrollEnd={onMomentumScrollEnd}
                // scrollEnabled={scrollEnabled}
                // pagingEnabled={true}
                // renderItem={renderItem}
                onEndReachedThreshold={END_REACH_THRESHOLD}
                onEndReached={fetchNextData}
                applyWindowCorrection={applyWindowCorrection}
                scrollViewProps={{
                    scrollEnabled,
                    snapToInterval: SCROLL_ITEM_HEIGHT,
                    disableIntervalMomentum: true,
                    onMomentumScrollEnd,
                }}
                // onLayout={onLayout}
                // getItemLayout={(data, index) => ({
                //     length: SCROLL_ITEM_HEIGHT,
                //     offset: SCROLL_ITEM_HEIGHT * index,
                //     index,
                // })}
                // Test improvement
                // maxToRenderPerBatch={1}
                // updateCellsBatchingPeriod={10000}
            />
        </SafeAreaView>
    );
};

export default memo(InfiniteScroll);

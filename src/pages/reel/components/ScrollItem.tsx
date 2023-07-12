import React, { type FC, memo } from "react";
import {
    View,
    Text,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import Swiper, { type SwiperInternals } from "react-native-swiper";
import Details from "./details/Details";
import VideoViewer from "./video/VideoViewer";
import { SCROLL_ITEM_HEIGHT } from "../commons/constants";
import { windowWidth } from "@/common/utils";
import { type InternalPost } from "./InfiniteScroll";

interface MainScrollItemProps {
    post: InternalPost;
    onPageChange?: (page: Page) => void;
    isVideoPaused?: boolean;
}

export type Page = "Profile" | "Video" | "Details" | "Changing";

const ScrollItem: FC<MainScrollItemProps> = ({
    post,
    onPageChange,
    isVideoPaused,
}: MainScrollItemProps) => {
    const onIndexChanged = (index: number): void => {
        let page: Page = "Profile";
        switch (index) {
            case 0:
                page = "Profile";
                break;
            case 1:
                page = "Video";
                break;
            case 2:
                page = "Details";
                break;
        }
        onPageChange?.(page);
    };

    const onScrollBeginDrag = (
        _e: NativeSyntheticEvent<NativeScrollEvent>,
        state: SwiperInternals,
        _swiper: Swiper
    ): void => {
        onPageChange?.("Changing");
    };

    const onScrollEndDrag = (
        _e: NativeSyntheticEvent<NativeScrollEvent>,
        state: SwiperInternals,
        _swiper: Swiper
    ): void => {
        const index = Math.round(state.offset.x / windowWidth);
        onIndexChanged(index);
    };

    return (
        <Swiper
            style={{ height: SCROLL_ITEM_HEIGHT }}
            loop={false}
            showsPagination={false}
            index={1}
            onScrollBeginDrag={onScrollBeginDrag}
            onMomentumScrollEnd={onScrollEndDrag}
        >
            <View className="flex-1 justify-center items-center bg-white">
                <Text>prrofile - {post.creator.username}</Text>
            </View>
            <View className="flex-1 justify-center items-center bg-white">
                <VideoViewer videoId={post.video} isPaused={isVideoPaused} />
            </View>
            <View className="flex-1">
                <Details post={post} />
            </View>
        </Swiper>
    );
};

export default memo(ScrollItem);

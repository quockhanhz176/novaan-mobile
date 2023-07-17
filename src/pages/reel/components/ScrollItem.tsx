import React, { type FC, memo, useEffect, useState } from "react";
import {
    View,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import Swiper, { type SwiperInternals } from "react-native-swiper";
import Details from "./details/Details";
import VideoViewer from "./video/VideoViewer";
import { SCROLL_ITEM_HEIGHT } from "../commons/constants";
import { windowWidth } from "@/common/utils";
import { type InternalPost } from "./InfiniteScroll";
import UserProfile from "@/pages/user-profile/UserProfile";

interface MainScrollItemProps {
    post: InternalPost;
    isInsideUserProfile?: boolean;
    onPageChange?: (page: Page) => void;
    isVideoPaused?: boolean;
}

export type Page = "Profile" | "Video" | "Details" | "Changing";

const ScrollItem: FC<MainScrollItemProps> = ({
    post,
    isInsideUserProfile = false,
    onPageChange,
    isVideoPaused,
}: MainScrollItemProps) => {
    // Introduce a very slight delay to make modal animation work
    const [mounted, setMounted] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(
        isInsideUserProfile ? 0 : 1
    );

    // Lazy loading for user profile screen
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 0);
    });

    useEffect(() => {
        if (showProfile) {
            return;
        }

        if (currentIndex === 0) {
            setShowProfile(true);
        }
    }, [currentIndex]);

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
        setCurrentIndex(index);
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

    if (!mounted) {
        return <View></View>;
    }

    return (
        <Swiper
            style={{ height: SCROLL_ITEM_HEIGHT }}
            loop={false}
            showsPagination={false}
            index={currentIndex}
            loadMinimal={true}
            loadMinimalSize={1}
            onScrollBeginDrag={onScrollBeginDrag}
            onMomentumScrollEnd={onScrollEndDrag}
        >
            {!isInsideUserProfile && showProfile ? (
                <View className="flex-1 justify-center items-center bg-white">
                    {/* Disable user profile view when viewing scroll item inside a profile */}
                    <View className="flex-1 w-screen">
                        <UserProfile
                            userId={post.creator.userId}
                            showBackButton={false}
                        />
                    </View>
                </View>
            ) : (
                <View className="flex-1 justify-center items-center bg-white"></View>
            )}
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

import React, { memo, useMemo, type ReactElement } from "react";
import {
    View,
    Text,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    useWindowDimensions,
} from "react-native";
import Swiper, { type SwiperInternals } from "react-native-swiper";
import reelServices from "../services/reelServices";
import PostDetails from "./PostDetails";
import VideoViewer from "./VideoViewer";
import { windowWidth } from "@/common/utils";

interface ScrollItemProps {
    onPageChange?: (page: Page) => void;
}

export type Page = "Profile" | "Video" | "Details";

const ScrollItem = ({
    onPageChange,
}: ScrollItemProps): ReactElement<ScrollItemProps> => {
    const post = useMemo(() => reelServices.getNextPost(), []);

    const dimension = useWindowDimensions();

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

    const handleScrollEndDrag = (
        _e: NativeSyntheticEvent<NativeScrollEvent>,
        state: SwiperInternals,
        _swiper: Swiper
    ): void => {
        const index = Math.round(state.offset.x / windowWidth);
        onIndexChanged(index);
    };

    return (
        <Swiper
            style={{ height: dimension.height }}
            loop={false}
            showsPagination={false}
            index={1}
            onMomentumScrollEnd={handleScrollEndDrag}
        >
            <View className="flex-1 justify-center items-center bg-white">
                <Text>profile</Text>
            </View>
            <View className="flex-1 justify-center items-center bg-white">
                <VideoViewer videoUri={post.video} />
            </View>
            <View className="flex-1">
                <PostDetails post={post} />
            </View>
        </Swiper>
    );
};

export default memo(ScrollItem);

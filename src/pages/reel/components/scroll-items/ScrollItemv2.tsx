import React, {
    memo,
    useEffect,
    useRef,
    useState,
    createContext,
    type ReactElement,
    useCallback,
} from "react";
import {
    View,
    Text,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import Swiper from "react-native-swiper";
import { type SwiperInternals } from "react-native-swiper";
import Details from "../../pages/details/Details";
import VideoViewer from "../../pages/video/VideoViewer";
import { SCROLL_ITEM_HEIGHT } from "../../commons/constants";
import { windowWidth } from "@/common/utils";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import { usePostInfo } from "@/api/post/PostApiHook";
import { type Undefinable } from "@/types/app";
import {
    type IScrollItemContext,
    scrollItemInitialStates,
    type LikeInfo,
} from "./item.type";
import UserProfileTab from "./UserProfileTab";
import { getUserIdFromToken } from "@/api/common/utils/TokenUtils";

export type Page =
    | "Profile"
    | "Video"
    | "Details"
    | "Changing"
    | "PostReport"
    | "Comments"
    | "AddComment";

interface MainScrollItemProps {
    post: MinimalPost;
    showUserProfile?: boolean;
    isVideoPaused: boolean;
    onPageChange?: (page: Page) => void;
    nextVideo: () => void;
}

export const ScrollItemContext = createContext<IScrollItemContext>(
    scrollItemInitialStates
);

const ScrollItem = ({
    post,
    showUserProfile = false,
    isVideoPaused,
    onPageChange,
    nextVideo,
}: MainScrollItemProps): ReactElement<MainScrollItemProps> => {
    // Introduce a very slight delay to make modal animation work
    const [mounted, setMounted] = useState(false);
    const [currentUserId, setCurrentUserId] =
        useState<Undefinable<string>>(undefined);

    const { postInfo, fetchPostInfo } = usePostInfo();

    const [isFailed, setIsFailed] = useState(false);

    const [likeInfo, setLikeInfo] = useState<LikeInfo>({
        liked: false,
        likeCount: 0,
    });
    const [saved, setSaved] = useState(false);
    const [currentPage, setCurrentPage] = useState(-1);

    const swiperRef = useRef<Swiper>(null);
    const videoViewerRef = useRef<any>(null);

    useEffect(() => {
        setMounted(true);

        void getUserIdFromToken().then((token) => {
            setCurrentUserId(token);
        });

        void fetchPostInfo(post).then((result) => {
            if (result === undefined) {
                setIsFailed(true);
                return;
            }
            const { isLiked, isSaved, likeCount } = result;
            setLikeInfo({
                liked: isLiked,
                likeCount: likeCount ?? (isLiked ? 1 : 0),
            });
            isSaved && setSaved(isSaved);
        });
    }, []);

    const pauseVideo = useCallback((): void => {
        videoViewerRef.current?.pauseVideo();
    }, [videoViewerRef]);

    const resumeVideo = useCallback((): void => {
        videoViewerRef.current?.resumeVideo();
    }, [videoViewerRef]);

    const onIndexChanged = (index: number): void => {
        // Record the first time user view profile
        if (showUserProfile && index === 0 && currentPage !== 0) {
            setCurrentPage(index);
        }

        let page: Page = "Profile";
        switch (index) {
            case 0:
                page = showUserProfile ? "Profile" : "Video";
                break;
            case 1:
                page = showUserProfile ? "Video" : "Details";
                break;
            case 2:
                page = showUserProfile ? "Details" : "Changing";
                break;
        }
        onPageChange?.(page);
    };

    const onScrollBeginDrag = (
        _e: NativeSyntheticEvent<NativeScrollEvent>,
        _state: SwiperInternals,
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

    const scrollTo = useCallback(
        (index: number): void => {
            swiperRef.current?.scrollTo(index, true);
        },
        [swiperRef.current]
    );

    const scrollToProfile = useCallback((): void => {
        scrollTo(0);
    }, [scrollTo]);

    const scrollToDetails = useCallback((): void => {
        scrollTo(2);
    }, [scrollTo]);

    const handleLike = (): void => {
        if (likeInfo.liked) {
            return;
        }
        setLikeInfo({ liked: true, likeCount: likeInfo.likeCount + 1 });
    };

    const handleUnlike = (): void => {
        if (!likeInfo.liked) {
            return;
        }
        setLikeInfo({ liked: false, likeCount: likeInfo.likeCount - 1 });
    };

    const handleSave = useCallback((): void => {
        setSaved(true);
    }, []);

    const handleUnsave = useCallback((): void => {
        setSaved(false);
    }, []);

    if (isFailed) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <Text className="text-base text-white">
                    Không thể tải bài viết
                </Text>
            </View>
        );
    }

    if (
        !mounted ||
        currentUserId == null ||
        currentUserId === "" ||
        postInfo == null
    ) {
        return <View></View>;
    }

    return (
        <ScrollItemContext.Provider
            value={{
                currentUserId,
                currentPost: postInfo,
                likeInfo,
                saved,
                handleLike,
                handleUnlike,
                handleSave,
                handleUnsave,
                pauseVideo,
                resumeVideo,
                nextVideo,
            }}
        >
            <Swiper
                ref={swiperRef}
                style={{ height: SCROLL_ITEM_HEIGHT }}
                loop={false}
                showsPagination={false}
                index={showUserProfile ? 1 : 0}
                onScrollBeginDrag={onScrollBeginDrag}
                onMomentumScrollEnd={onScrollEndDrag}
            >
                {showUserProfile && postInfo?.creator?.userId != null && (
                    <View className="flex-1 justify-center items-center bg-white">
                        {/* <View className="flex-1 w-screen">
                            <UserProfile
                                userId={postInfo.creator.userId}
                                showBackButton={false}
                            />
                        </View> */}
                        {/* Avoid render profile page until it is needed */}
                        <UserProfileTab
                            userId={postInfo.creator.userId}
                            showBackButton={false}
                            userProfileVisible={currentPage === 0}
                        />
                    </View>
                )}
                <View className="flex-1 justify-center items-center bg-white">
                    <VideoViewer
                        isVideoPaused={isVideoPaused}
                        ref={videoViewerRef}
                        onShowDetails={scrollToDetails}
                        onShowProfile={scrollToProfile}
                    />
                </View>
                <View className="flex-1">
                    <Details />
                </View>
            </Swiper>
        </ScrollItemContext.Provider>
    );
};

export default memo(ScrollItem);

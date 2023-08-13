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
    ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import { type SwiperInternals } from "react-native-swiper";
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
import { MD2Colors } from "react-native-paper";
import { REEL_FAILED_TO_LOAD } from "@/common/strings";
import CustomModal from "@/common/components/CustomModal";
import useBooleanHook from "@/common/components/BooleanHook";
import AdminComments from "./AdminComments";
import DetailsTab from "./DetailsTab";

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

    const [adminCommentOpen, hideAdminComment, showAdminComment] =
        useBooleanHook();

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

            if (result.status === "Rejected" || result.status === "Reported") {
                pauseVideo();
                showAdminComment();
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
        setLikeInfo((info) => ({ liked: true, likeCount: info.likeCount + 1 }));
    };

    const handleUnlike = (): void => {
        if (!likeInfo.liked) {
            return;
        }
        setLikeInfo((info) => ({
            liked: false,
            likeCount: info.likeCount - 1,
        }));
    };

    const handleSave = useCallback((): void => {
        setSaved(true);
    }, []);

    const handleUnsave = useCallback((): void => {
        setSaved(false);
    }, []);

    const handleHideAdminComment = (): void => {
        hideAdminComment();
        resumeVideo();
    };

    if (isFailed) {
        return (
            <View
                style={{ height: SCROLL_ITEM_HEIGHT }}
                className="w-full bg-black"
            >
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white">{REEL_FAILED_TO_LOAD}</Text>
                </View>
            </View>
        );
    }

    if (
        !mounted ||
        currentUserId == null ||
        currentUserId === "" ||
        postInfo == null
    ) {
        return (
            <View style={{ height: SCROLL_ITEM_HEIGHT }}>
                <ActivityIndicator
                    animating={true}
                    color={MD2Colors.red400}
                    size={100}
                    className="absolute top-0 bottom-0 right-0 left-0 opacity-75 bg-black"
                />
            </View>
        );
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
                    <DetailsTab visible={currentPage === 2} />
                </View>
            </Swiper>
            {adminCommentOpen && (
                <CustomModal
                    visible={adminCommentOpen}
                    onDismiss={handleHideAdminComment}
                >
                    <AdminComments onDismiss={handleHideAdminComment} />
                </CustomModal>
            )}
        </ScrollItemContext.Provider>
    );
};

export default memo(ScrollItem);

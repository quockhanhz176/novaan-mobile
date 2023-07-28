import React, {
    memo,
    useEffect,
    useRef,
    useState,
    createContext,
    type ReactElement,
    useReducer,
    type Dispatch,
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
import UserProfile from "@/pages/user-profile/UserProfile";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import { usePostInfo } from "@/api/post/PostApiHook";
import type Post from "../../types/Post";
import { type Undefinable } from "@/types/app";
import { type ScrollItemAction, scrollItemReducer } from "./ScrollItemReducer";
import { getUserIdFromToken } from "@/api/common/utils/TokenUtils";

interface MainScrollItemProps {
    post: MinimalPost;
    showUserProfile?: boolean;
    isVideoPaused?: boolean;
    onPageChange?: (page: Page) => void;
    nextVideo: () => void;
}

export type Page =
    | "Profile"
    | "Video"
    | "Details"
    | "Changing"
    | "PostReport"
    | "Comments"
    | "AddComment";

export interface IScrollItemContext {
    dispatch: Dispatch<{ type: ScrollItemAction; payload?: any }>;
    currentPost?: Post;
    currentUserId?: string;
    pauseVideo: () => void;
    resumeVideo: () => void;
    nextVideo: () => void;
}

const scrollItemInitialStates: IScrollItemContext = {
    currentPost: undefined,
    currentUserId: undefined,
    dispatch: () => {},
    pauseVideo: () => {},
    resumeVideo: () => {},
    nextVideo: () => {},
};

export const ScrollItemContext = createContext<IScrollItemContext>(
    scrollItemInitialStates
);

const ScrollItem = ({
    post,
    showUserProfile = false,
    isVideoPaused = false,
    onPageChange,
    nextVideo,
}: MainScrollItemProps): ReactElement<MainScrollItemProps> => {
    // Introduce a very slight delay to make modal animation work
    const [mounted, setMounted] = useState(false);
    const [isPaused, setIsPaused] = useState(isVideoPaused);
    const [currentUserId, setCurrentUserId] =
        useState<Undefinable<string>>(undefined);

    const { postInfo, fetchPostInfo } = usePostInfo();
    const [state, dispatch] = useReducer(scrollItemReducer, {
        currentPost: undefined,
    });

    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        if (postInfo == null) {
            return;
        }
        dispatch({ type: "INIT", payload: { currentPost: postInfo } });
    }, [postInfo]);

    const swiperRef = useRef<Swiper>(null);

    const getCurrentUserId = async (): Promise<void> => {
        const userId = await getUserIdFromToken();
        setCurrentUserId(userId);
    };

    const fetchCurrentPostInfo = async (): Promise<void> => {
        const succeed = await fetchPostInfo(post);
        if (succeed) {
            return;
        }
        setIsFailed(true);
    };

    useEffect(() => {
        setMounted(true);
        void getCurrentUserId();
        void fetchCurrentPostInfo();
    }, []);

    useEffect(() => {
        if (!isFailed) {
            return;
        }
        // Retry once when failed
        void fetchPostInfo(post).then((succeed) => {
            if (succeed) {
                setIsFailed(false);
                return;
            }

            // Go to next video if still fail (if possible)
            nextVideo();
        });
    }, [isFailed]);

    useEffect(() => {
        if (isVideoPaused === isPaused) {
            return;
        }
        setIsPaused(isVideoPaused);
    }, [isVideoPaused]);

    const pauseVideo = (): void => {
        setIsPaused(true);
    };

    const resumeVideo = (): void => {
        setIsPaused(false);
    };

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

    const scrollTo = (index: number): void => {
        swiperRef.current?.scrollTo(index, true);
    };

    const scrollToProfile = (): void => {
        scrollTo(0);
    };

    const scrollToDetails = (): void => {
        scrollTo(2);
    };

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
        state.currentPost == null
    ) {
        return <View></View>;
    }

    return (
        <ScrollItemContext.Provider
            value={{
                currentPost: state.currentPost,
                currentUserId,
                dispatch,
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
                loadMinimal={true}
                loadMinimalSize={1}
                onScrollBeginDrag={onScrollBeginDrag}
                onMomentumScrollEnd={onScrollEndDrag}
            >
                {showUserProfile && (
                    <View className="flex-1 justify-center items-center bg-white">
                        <View className="flex-1 w-screen">
                            <UserProfile
                                userId={state.currentPost.creator.userId}
                                showBackButton={false}
                            />
                        </View>
                    </View>
                )}
                <View className="flex-1 justify-center items-center bg-white">
                    <VideoViewer
                        isPaused={isPaused}
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

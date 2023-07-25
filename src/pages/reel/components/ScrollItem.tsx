import React, {
    type FC,
    memo,
    useEffect,
    useRef,
    createRef,
    useState,
} from "react";
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
import ReportForm from "./common/ReportForm";
import CustomModal from "@/common/components/CustomModal";
import Comments from "./common/Comments";
import type ScrollItemController from "../types/ScrollItemController";
import useModalHook from "../../../common/components/ModalHook";
import postApi from "@/api/post/PostApi";
import type PostComment from "../types/PostComment";
import reelServices from "../services/reelServices";
import { getUserIdFromToken } from "@/api/profile/ProfileApi";

interface MainScrollItemProps {
    post: InternalPost;
    showUserProfile?: boolean;
    onPageChange?: (page: Page) => void;
    isVideoPaused?: boolean;
}

export type Page =
    | "Profile"
    | "Video"
    | "Details"
    | "Changing"
    | "PostReport"
    | "Comments"
    | "AddComment";

const ScrollItem: FC<MainScrollItemProps> = ({
    post,
    showUserProfile = false,
    onPageChange,
    isVideoPaused,
}: MainScrollItemProps) => {
    // Introduce a very slight delay to make modal animation work
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getOnModalShownChange = (page: Page): ((value: boolean) => void) => {
        return (value: boolean): void => {
            if (value) {
                onPageChange?.(page);
            } else {
                onPageChange?.(currentPage.current);
            }
        };
    };

    const [reportFormVisible, hideReportForm, showReportForm] = useModalHook(
        getOnModalShownChange("PostReport")
    );
    const [commentsVisible, hideComments, showComments] = useModalHook(
        getOnModalShownChange("Comments")
    );
    const currentPage =
        useRef<Exclude<Page, "PostReport" | "Comments">>("Video");
    const swiperRef = createRef<Swiper>();
    const [liked, setLiked] = useState(post.isLiked);
    const [saved, setSaved] = useState(post.isLiked);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [thisUserComment, setThisUserComment] = useState<
        PostComment | undefined
    >();

    const fetchComments = async (): Promise<void> => {
        const result = await reelServices.getComments(post.id);
        if (result != null) {
            setComments(result);
            try {
                const userId = await getUserIdFromToken();
                const comment = result.find((value) => value.userId === userId);
                setThisUserComment(comment);
            } catch {}
        }
    };

    useEffect(() => {
        void fetchComments();
    }, []);

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
        currentPage.current = page;
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
        if (showUserProfile) {
            scrollTo(0);
        }
    };

    const showDetails = (): void => {
        scrollTo(showUserProfile ? 2 : 1);
    };

    const onLikePress = (): void => {
        void postApi.setPostLike(post.id, !liked, post.type);
        setLiked(!liked);
    };

    const onSavePress = (): void => {
        void postApi.setPostSave(post.id, !saved, post.type);
        setSaved(!saved);
    };

    const scrollItemController: ScrollItemController = {
        showProfile: scrollToProfile,
        showDetails,
        liked,
        saved,
        likePressed: onLikePress,
        savePressed: onSavePress,
        showRating: showComments,
        showReport: showReportForm,
    };

    if (!mounted) {
        return <View></View>;
    }

    return (
        <View>
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
                        {/* Disable user profile view when viewing scroll item inside a profile */}
                        <View className="flex-1 w-screen">
                            <UserProfile
                                userId={post.creator.userId}
                                showBackButton={false}
                            />
                        </View>
                    </View>
                )}
                <View className="flex-1 justify-center items-center bg-white">
                    <VideoViewer
                        post={post}
                        commentCount={comments.length}
                        isPaused={isVideoPaused}
                        scrollItemController={scrollItemController}
                    />
                </View>
                <View className="flex-1">
                    <Details
                        post={post}
                        commentCount={comments.length}
                        scrollItemController={scrollItemController}
                    />
                </View>
            </Swiper>
            <CustomModal visible={reportFormVisible} onDismiss={hideReportForm}>
                <ReportForm post={post} closeReportForm={hideReportForm} />
            </CustomModal>
            <CustomModal visible={commentsVisible} onDismiss={hideComments}>
                <Comments
                    comments={comments}
                    closeComments={hideComments}
                    reloadComments={fetchComments}
                    post={post}
                    thisUserComment={thisUserComment}
                />
            </CustomModal>
        </View>
    );
};

export default memo(ScrollItem);

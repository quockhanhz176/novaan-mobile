interface ScrollItemController {
    // setReportFormShown?: (value: boolean) => void;
    // setCommentsShown?: (value: boolean) => void;
    // setCommentFormShown?: (value: boolean) => void;
    showProfile?: () => void;
    showDetails?: () => void;
    savePressed?: () => void;
    showRating?: () => void;
    showReport?: () => void;
    liked: boolean;
    likePressed?: () => void;
    saved: boolean;
}

export default ScrollItemController;

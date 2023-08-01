import {
    REEL_REPORT_FORM_REPORT_FAIL_MESSAGE,
    REEL_REPORT_FORM_REPORT_SUCCESS_MESSAGE,
    REEL_VIDEO_REPORT,
} from "@/common/strings";
import React, { type ReactElement, useState, useContext } from "react";
import VideoButton from "../VideoButton";
import { Modal } from "react-native";
import ReportForm from "@/pages/reel/components/report/ReportForm";
import { usePostReport } from "@/api/post/PostApiHook";
import { ScrollItemContext } from "@/pages/reel/components/scroll-items/ScrollItemv2";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const ReportButton = (): ReactElement => {
    const { currentPost } = useContext(ScrollItemContext);
    const { reportPost } = usePostReport();
    const [showReport, setShowReport] = useState(false);

    const openReportForm = (): void => {
        setShowReport(true);
    };

    const closeReportForm = (): void => {
        setShowReport(false);
    };

    const handleReportSubmit = async (reason: string): Promise<void> => {
        if (currentPost == null) {
            return;
        }
        const payload: MinimalPost = {
            postId: currentPost.id,
            postType: currentPost.type === "recipe" ? "Recipe" : "CulinaryTip",
        };
        const succeed = await reportPost(payload, reason);
        if (!succeed) {
            Toast.show({
                type: "error",
                text1: REEL_REPORT_FORM_REPORT_FAIL_MESSAGE,
            });
        }
        Toast.show({
            type: "success",
            text1: REEL_REPORT_FORM_REPORT_SUCCESS_MESSAGE,
        });
    };

    if (currentPost == null) {
        return (
            <VideoButton
                iconPack="Material"
                icon="flag"
                text={REEL_VIDEO_REPORT}
            />
        );
    }

    return (
        <>
            <VideoButton
                iconPack="Material"
                icon="flag"
                text={REEL_VIDEO_REPORT}
                onPress={openReportForm}
            />
            <Modal
                visible={showReport}
                onRequestClose={closeReportForm}
                animationType="slide"
            >
                <ReportForm
                    onClose={closeReportForm}
                    onSubmit={handleReportSubmit}
                />
            </Modal>
        </>
    );
};

export default ReportButton;

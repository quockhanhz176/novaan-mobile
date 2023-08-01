import IconLabelButton from "@/common/components/IconLabelButton";
import {
    REEL_REPORT_FORM_REPORT,
    REEL_REPORT_FORM_REPORT_ALERT_TITLE,
    REEL_REPORT_FORM_REPORT_FAIL_MESSAGE,
    REEL_REPORT_FORM_REPORT_NO_MESSAGE_ERROR,
    REEL_REPORT_FORM_REPORT_PLACEHOLDER,
    REEL_REPORT_FORM_REPORT_SUCCESS_MESSAGE,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import { useState, type FC, memo } from "react";
import React, { View, TextInput, Alert } from "react-native";
import postApi from "@/api/post/PostApi";
import Toast from "react-native-toast-message";
import type Post from "../types/Post";

interface ReportFormProps {
    post: Post;
    closeReportForm?: () => void;
}

const ReportForm: FC<ReportFormProps> = ({ post, closeReportForm }) => {
    const [text, setText] = useState("");

    const onClosePress = (): void => {
        closeReportForm?.();
    };

    const onReportSubmit = (): void => {
        if (text === "") {
            Alert.alert(
                REEL_REPORT_FORM_REPORT_ALERT_TITLE,
                REEL_REPORT_FORM_REPORT_NO_MESSAGE_ERROR
            );
            return;
        }

        void (async (): Promise<void> => {
            const result = await postApi.reportPost(post.id, text, post.type);
            if (result.success) {
                Toast.show({
                    type: "success",
                    text1: REEL_REPORT_FORM_REPORT_SUCCESS_MESSAGE,
                });
            }

            Toast.show({
                type: "error",
                text1: REEL_REPORT_FORM_REPORT_FAIL_MESSAGE,
            });
        })();
        closeReportForm?.();
        setText("");
    };

    return (
        <View className="w-full h-full justify-center px-6 bg-transparent">
            <View
                className="px-4 w-full items-end space-y-3 pb-4 pt-3 mb-[100] bg-white"
                style={{ marginRight: 100 }}
                onTouchEnd={(e) => {
                    e.stopPropagation();
                }}
            >
                <IconLabelButton
                    iconProps={{
                        name: "close",
                        color: customColors.cgrey.battleship,
                        size: 22,
                    }}
                    iconPack="Evil"
                    buttonProps={{ onPress: onClosePress }}
                />
                <TextInput
                    className="text-base w-full border-cgrey-platinum bg-cgrey-seasalt p-3"
                    style={{ borderBottomWidth: 1 }}
                    multiline={true}
                    placeholder={REEL_REPORT_FORM_REPORT_PLACEHOLDER}
                    value={text}
                    numberOfLines={3}
                    textAlignVertical="top"
                    onChangeText={setText}
                />
                <IconLabelButton
                    iconProps={{ name: "flag", color: "white", size: 18 }}
                    text={REEL_REPORT_FORM_REPORT}
                    textClassName="text-white"
                    buttonClassName="bg-cprimary-200 p-2 rounded-md"
                    buttonProps={{ onPress: onReportSubmit }}
                />
            </View>
        </View>
    );
};

export default memo(ReportForm);

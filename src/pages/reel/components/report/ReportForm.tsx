import {
    ADD_COMMENT_SUBMIT,
    REEL_REPORT_FORM_SORRY,
    REEL_REPORT_FORM_REPORT,
    REEL_REPORT_FORM_REPORT_PLACEHOLDER,
    REEL_REPORT_FORM_TITLE,
    REEL_REPORT_FORM_REPORT_ALERT_TITLE,
    REEL_REPORT_FORM_REPORT_NO_MESSAGE_ERROR,
} from "@/common/strings";
import React, { type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";

interface ReportFormProps {
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

interface FormData {
    reason: string;
}

const ReportForm = ({
    onClose,
    onSubmit,
}: ReportFormProps): ReactElement<ReportFormProps> => {
    const { handleSubmit, control, reset } = useForm<FormData>({
        defaultValues: { reason: "" },
    });

    const handleFormSubmit = (data: FormData): void => {
        if (data.reason == null || data.reason === "") {
            Alert.alert(
                REEL_REPORT_FORM_REPORT_ALERT_TITLE,
                REEL_REPORT_FORM_REPORT_NO_MESSAGE_ERROR
            );
            return;
        }

        onSubmit(data.reason);
        handleCloseForm();
    };

    const handleCloseForm = (): void => {
        reset();
        onClose();
    };

    return (
        <>
            <View className="h-[58] flex-row items-center justify-between px-1 border-b-2 border-cgrey-platinum">
                <View className="flex-row space-x-2 items-center">
                    <TouchableOpacity
                        activeOpacity={0.2}
                        className="h-10 w-10 items-center justify-center"
                        onPress={handleCloseForm}
                    >
                        <IconEvill name="close" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-medium">
                        {REEL_REPORT_FORM_REPORT}
                    </Text>
                </View>
                <TouchableOpacity
                    className="px-4"
                    onPress={handleSubmit(handleFormSubmit)}
                >
                    <Text className="uppercase font-bold text-csecondary">
                        {ADD_COMMENT_SUBMIT}
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="flex-1 mx-4 mt-2">
                <View className="px-2 py-4 bg-ctertiary rounded-lg">
                    <Text className="text-base">{REEL_REPORT_FORM_SORRY}</Text>
                </View>
                <Text className="my-2 text-base">{REEL_REPORT_FORM_TITLE}</Text>
                <View className="border-2 border-cprimary-300 rounded-lg">
                    <Controller
                        control={control}
                        name="reason"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="px-4 pt-2 pb-10 rounded-lg"
                                autoCapitalize="none"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder={
                                    REEL_REPORT_FORM_REPORT_PLACEHOLDER
                                }
                            />
                        )}
                    />
                </View>
            </View>
        </>
    );
};

export default ReportForm;

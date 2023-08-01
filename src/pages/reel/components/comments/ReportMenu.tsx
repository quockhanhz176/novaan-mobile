import IconLabelButton from "@/common/components/IconLabelButton";
import { REEL_COMMENTS_TITLE, REEL_REPORT_FORM_REPORT } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import React, { type ReactElement } from "react";
import { View, Text } from "react-native";

interface ReportMenuProps {
    handleReportComment: () => void;
}

const ReportMenu = ({
    handleReportComment,
}: ReportMenuProps): ReactElement<ReportMenuProps> => {
    return (
        <View className="flex-1 justify-end mb-2">
            <View
                className="bg-white rounded-xl py-2 h-1/6"
                onTouchStart={(e) => {
                    e.stopPropagation();
                }}
            >
                <View className="pl-4 start flex-row justify-between items-center">
                    <View className="flex-row items-start justify-center">
                        <Text className="text-base font-semibold">
                            {REEL_COMMENTS_TITLE}
                        </Text>
                    </View>
                </View>
                <View className="flex-1 justify-evenly">
                    <IconLabelButton
                        iconPack="Community"
                        iconProps={{
                            name: "flag-outline",
                            size: 24,
                            color: customColors.black,
                        }}
                        text={REEL_REPORT_FORM_REPORT}
                        textClassName="text-base text-gray-800 font-normal"
                        buttonClassName="px-4 flex-1 space-x-3 items-center"
                        buttonProps={{ onPress: handleReportComment }}
                    />
                </View>
            </View>
        </View>
    );
};

export default ReportMenu;

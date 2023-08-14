import IconLabelButton from "@/common/components/IconLabelButton";
import {
    REEL_COMMENTS_DELETE_BUTTON,
    REEL_COMMENTS_EDIT_BUTTON,
    REEL_COMMENTS_TITLE,
} from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import React, { type ReactElement } from "react";
import { View, Text } from "react-native";

interface CommentMenuProps {
    handleEditComment: () => void;
    handleDeleteComment: () => void;
}

const CommentMenu = ({
    handleEditComment,
    handleDeleteComment,
}: CommentMenuProps): ReactElement<CommentMenuProps> => {
    return (
        <View className="flex-1 justify-end mb-2">
            <View
                className="bg-white rounded-xl h-1/6 m-2 py-2"
                onTouchStart={(e) => {
                    e.stopPropagation();
                }}
            >
                <View className="pt-2 pb-1 pl-4 start flex-row justify-between items-center">
                    <View className="flex-row items-start justify-center">
                        <Text className="text-base">{REEL_COMMENTS_TITLE}</Text>
                    </View>
                </View>
                <View className="flex-1">
                    <IconLabelButton
                        iconPack="Community"
                        iconProps={{
                            name: "pencil-outline",
                            size: 24,
                            color: customColors.black,
                        }}
                        text={REEL_COMMENTS_EDIT_BUTTON}
                        textClassName="text-base text-gray-800 font-normal"
                        buttonClassName="px-4 flex-1 space-x-3 items-center"
                        buttonProps={{ onPress: handleEditComment }}
                    />
                    <IconLabelButton
                        iconPack="Community"
                        iconProps={{
                            name: "delete-outline",
                            size: 24,
                            color: customColors.black,
                        }}
                        text={REEL_COMMENTS_DELETE_BUTTON}
                        textClassName="text-base text-gray-800 font-normal"
                        buttonClassName="px-4 flex-1 space-x-3 items-center"
                        buttonProps={{ onPress: handleDeleteComment }}
                    />
                </View>
            </View>
        </View>
    );
};

export default CommentMenu;

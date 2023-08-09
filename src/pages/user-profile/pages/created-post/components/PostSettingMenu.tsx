import IconLabelButton from "@/common/components/IconLabelButton";
import { PROFILE_EDIT_POST, PROFILE_DELETE_POST } from "@/common/strings";
import { customColors } from "@root/tailwind.config";
import React, { type ReactElement } from "react";
import { View } from "react-native";

interface PostSettingMenuProps {
    onEditPost: () => void;
    onDeletePost: () => void;
}

const PostSettingMenu = ({
    onEditPost,
    onDeletePost,
}: PostSettingMenuProps): ReactElement<PostSettingMenuProps> => {
    return (
        <View className="flex-1 justify-end mb-2">
            <View
                className="bg-white rounded-xl h-1/6"
                onTouchStart={(e) => {
                    e.stopPropagation();
                }}
            >
                <View className="flex-1 my-2">
                    <IconLabelButton
                        iconPack="Feather"
                        iconProps={{
                            name: "edit-2",
                            size: 24,
                            color: customColors.black,
                        }}
                        text={PROFILE_EDIT_POST}
                        textClassName="text-base text-gray-800 font-normal"
                        buttonClassName="px-4 flex-1 space-x-3 items-center"
                        buttonProps={{ onPress: onEditPost }}
                    />
                    <IconLabelButton
                        iconPack="Feather"
                        iconProps={{
                            name: "trash-2",
                            size: 24,
                            color: customColors.black,
                        }}
                        text={PROFILE_DELETE_POST}
                        textClassName="text-base text-gray-800 font-normal"
                        buttonClassName="px-4 flex-1 space-x-3 items-center"
                        buttonProps={{ onPress: onDeletePost }}
                    />
                </View>
            </View>
        </View>
    );
};

export default PostSettingMenu;

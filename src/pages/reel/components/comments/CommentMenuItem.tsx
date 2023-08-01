import React from "react";
import IconLabelButton from "@/common/components/IconLabelButton";
import { customColors } from "@root/tailwind.config";
import { type ReactElement } from "react";
import { MenuOption } from "react-native-popup-menu";

interface CommentMenuItemProps {
    icon: string;
    text: string;
    onSelect?: () => void;
}

const CommentMenuItem = ({
    icon,
    text,
    onSelect,
}: CommentMenuItemProps): ReactElement<CommentMenuItemProps> => {
    return (
        <MenuOption onSelect={onSelect}>
            <IconLabelButton
                iconPack="Material"
                iconProps={{
                    name: icon,
                    color: customColors.cgrey.dim,
                    size: 20,
                }}
                text={text}
                buttonProps={{ disabled: true }}
                buttonClassName="bg-transparent space-x-2 px-2 py-1"
            />
        </MenuOption>
    );
};

export default CommentMenuItem;

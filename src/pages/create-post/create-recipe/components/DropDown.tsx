import React, { useState, type FC } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface DropDownProps {
    items: Array<{ label: string; value: string }>;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    dropDownContainerStyle?: StyleProp<ViewStyle>;
    listItemContainerStyle?: StyleProp<ViewStyle>;
}

const DropDown: FC<DropDownProps> = ({
    items,
    onValueChange,
    style,
    textStyle,
    placeholder,
    dropDownContainerStyle,
    listItemContainerStyle,
}: DropDownProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [itemList, setItemList] = useState(items);

    return (
        <DropDownPicker
            dropDownContainerStyle={dropDownContainerStyle}
            listItemContainerStyle={listItemContainerStyle}
            placeholder={placeholder}
            textStyle={textStyle}
            style={style}
            open={open}
            value={value}
            items={itemList}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItemList}
            onChangeValue={onValueChange}
        />
    );
};

export default DropDown;

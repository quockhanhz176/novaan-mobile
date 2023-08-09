import React, { useState, type FC, useEffect } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface DropDownProps {
    selectValue: string;
    items: Array<{ label: string; value: string }>;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    dropDownContainerStyle?: StyleProp<ViewStyle>;
    listItemContainerStyle?: StyleProp<ViewStyle>;
}

const DropDown: FC<DropDownProps> = ({
    selectValue,
    items,
    onValueChange,
    style,
    textStyle,
    placeholder,
    dropDownContainerStyle,
    listItemContainerStyle,
}: DropDownProps) => {
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(selectValue);
    const [itemList, setItemList] = useState(items);

    useEffect(() => {
        setItem(selectValue);
    }, [selectValue]);

    return (
        <DropDownPicker
            dropDownContainerStyle={dropDownContainerStyle}
            listItemContainerStyle={listItemContainerStyle}
            placeholder={placeholder}
            textStyle={textStyle}
            style={style}
            open={open}
            value={item}
            setValue={setItem}
            items={itemList}
            setOpen={setOpen}
            setItems={setItemList}
            onChangeValue={onValueChange}
            listMode="SCROLLVIEW"
        />
    );
};

export default DropDown;

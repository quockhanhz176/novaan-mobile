import React from "react";
import { customColors } from "@root/tailwind.config";
import {
    BaseToast,
    type ToastConfig,
    type BaseToastProps,
} from "react-native-toast-message";
import { type ColorValue } from "react-native";

const getDefaultProps: (color: ColorValue) => BaseToastProps = (color) => ({
    style: {
        borderLeftColor: color,
        borderLeftWidth: 12,
    },
    contentContainerStyle: {
        paddingHorizontal: 16,
    },
    text1Style: {
        fontSize: 16,
    },
    text1NumberOfLines: 2,
});

export const toastConfig: ToastConfig = {
    success: (props: BaseToastProps) => (
        <BaseToast
            {...props}
            {...getDefaultProps(customColors.cprimary["300"])}
        />
    ),
    error: (props: BaseToastProps) => (
        <BaseToast {...props} {...getDefaultProps(customColors.cwarning)} />
    ),
    info: (props: BaseToastProps) => (
        <BaseToast {...props} {...getDefaultProps(customColors.cinfo)} />
    ),
};

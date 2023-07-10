import React from "react";
import { customColors } from "@root/tailwind.config";
import { BaseToast } from "react-native-toast-message";

export const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: customColors.cprimary["300"],
                borderLeftWidth: 12,
            }}
            contentContainerStyle={{
                paddingHorizontal: 16,
            }}
            text1Style={{
                fontSize: 16,
            }}
            text1NumberOfLines={2}
        />
    ),
    error: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: customColors.cwarning,
                borderLeftWidth: 12,
            }}
            contentContainerStyle={{
                paddingHorizontal: 16,
            }}
            text1Style={{
                fontSize: 16,
            }}
            text1NumberOfLines={2}
        />
    ),
    info: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: customColors.cinfo,
                borderLeftWidth: 12,
            }}
            contentContainerStyle={{
                paddingHorizontal: 16,
            }}
            text1Style={{
                fontSize: 16,
            }}
            text1NumberOfLines={2}
        />
    ),
};

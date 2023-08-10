import React, { type FC, type ReactElement, memo } from "react";
import { View, Text } from "react-native";

interface TitleSectionProps {
    title: string;
    children: ReactElement;
}

const TitleSection: FC<TitleSectionProps> = ({ title, children }) => {
    return (
        <View className="w-full mb-12">
            <Text className="text-xl font-bold tracking-wide mb-5 ml-4">{title}</Text>
            {children}
        </View>
    );
};

export default memo(TitleSection);

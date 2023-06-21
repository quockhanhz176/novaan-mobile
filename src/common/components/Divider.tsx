import React, { type ReactElement } from "react";
import { View, Text } from "react-native";

interface DividerProps {
    title: string;
}

const Divider = (props: DividerProps): ReactElement<DividerProps> => {
    return (
        <View className="flex-row items-center">
            <View className="flex-1 bg-gray-400" style={{ height: 1 }}></View>
            <View>
                <Text className="w-auto text-center mx-2 text-gray-400">
                    {props.title}
                </Text>
            </View>
            <View className="flex-1 bg-gray-400" style={{ height: 1 }}></View>
        </View>
    );
};

export default Divider;

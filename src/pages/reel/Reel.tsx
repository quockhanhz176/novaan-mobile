import React, { type FC } from "react";
import { View } from "react-native";
import InfiniteScroll from "./components/InfiniteScroll";

const Reel: FC = () => {
    return (
        <View className="flex-1 justify-end">
            <InfiniteScroll />
        </View>
    );
};

export default Reel;

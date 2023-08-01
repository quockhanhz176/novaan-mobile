import { type MinimalPostInfo } from "@/api/profile/types";
import React, { type ReactElement } from "react";
import { View } from "react-native";
import { Card } from "react-native-paper";

interface CreatedPostItemProps {
    item: MinimalPostInfo;
    onItemPress: () => void;
}

const CreatedPostItem = ({
    item,
    onItemPress,
}: CreatedPostItemProps): ReactElement<CreatedPostItemProps> => {
    return (
        <View className="w-1/2 items-center my-2">
            <Card
                mode="elevated"
                className="bg-white w-5/6"
                style={{ width: "90%" }}
                onPress={onItemPress}
            >
                <Card.Cover
                    source={{
                        // TODO: Replace with thumbnail later
                        uri: item.title,
                    }}
                    theme={{ roundness: 10, isV3: false }}
                />
                <Card.Title
                    title={item.title}
                    className="p-2 mt-1"
                    titleNumberOfLines={2}
                    titleStyle={{
                        fontSize: 16,
                        fontWeight: "600",
                    }}
                />
            </Card>
        </View>
    );
};

export default CreatedPostItem;

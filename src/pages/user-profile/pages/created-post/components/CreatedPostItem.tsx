import { type MinimalPostInfo } from "@/api/profile/types";
import React, { memo, useState, type ReactElement } from "react";
import {
    type ImageErrorEventData,
    type NativeSyntheticEvent,
    View,
} from "react-native";
import { Card } from "react-native-paper";
import MaterialCIcon from "react-native-vector-icons/MaterialCommunityIcons";

interface CreatedPostItemProps {
    item: MinimalPostInfo;
    onItemPress: () => void;
}

const CreatedPostItem = ({
    item,
    onItemPress,
}: CreatedPostItemProps): ReactElement<CreatedPostItemProps> => {
    const [imageFailed, setImageFailed] = useState(false);

    const handleError = (
        e: NativeSyntheticEvent<ImageErrorEventData>
    ): void => {
        setImageFailed(true);
    };

    return (
        <View className="w-1/2 items-center my-2">
            <Card
                mode="elevated"
                className="bg-white w-5/6"
                style={{ width: "90%" }}
                onPress={onItemPress}
            >
                {!imageFailed ? (
                    <Card.Cover
                        source={{
                            // TODO: Replace with thumbnail later
                            uri: item.title,
                        }}
                        onError={handleError}
                        theme={{ roundness: 10, isV3: false }}
                    />
                ) : (
                    <View
                        className="flex-1 justify-center items-center bg-gray-200 rounded-t-lg"
                        style={{ height: 195 }}
                    >
                        <MaterialCIcon
                            name="file-image-remove-outline"
                            size={24}
                        />
                    </View>
                )}
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

export default memo(CreatedPostItem, (prev, next) => prev.item === next.item);

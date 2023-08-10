import { type MinimalPostInfo } from "@/api/profile/types";
import React, { memo, useState, type ReactElement } from "react";
import {
    type ImageErrorEventData,
    type NativeSyntheticEvent,
    View,
} from "react-native";
import { Card } from "react-native-paper";
import MaterialCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import PostItemStatusOverlay from "./PostItemStatusOverlay";
import { customColors } from "@root/tailwind.config";

interface CreatedPostItemProps {
    index: number;
    item: MinimalPostInfo;
    onItemPress: (item: MinimalPostInfo, index: number) => void;
}

const CreatedPostItem = ({
    index,
    item,
    onItemPress,
}: CreatedPostItemProps): ReactElement<CreatedPostItemProps> => {
    const [imageFailed, setImageFailed] = useState(false);

    const handleError = (
        e: NativeSyntheticEvent<ImageErrorEventData>
    ): void => {
        setImageFailed(true);
    };

    const onPress = (): void => {
        onItemPress(item, index);
    };

    if (item.title === "Communication: Roosters") {
        console.log(imageFailed);
    }

    return (
        <View className="w-1/2 items-center my-2">
            <Card
                mode="elevated"
                className="bg-white w-5/6"
                style={{ width: "90%", position: "relative" }}
                onPress={onPress}
            >
                {item.status != null && (
                    <PostItemStatusOverlay status={item.status} />
                )}
                {!imageFailed ? (
                    <Card.Cover
                        source={{
                            // TODO: Replace with thumbnail later
                            uri: item.title,
                        }}
                        onError={handleError}
                        theme={{ roundness: 4 }}
                    />
                ) : (
                    <View
                        className="justify-center items-center bg-gray-200 rounded-t-lg"
                        style={{ height: 195, minHeight: 195 }}
                    >
                        <MaterialCIcon
                            name="file-image-remove-outline"
                            size={40}
                            color={customColors.cgrey.grey}
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

export default memo(CreatedPostItem);

import { type PostType } from "@/api/post/types/PostResponse";
import ResourceImage from "@/common/components/ResourceImage";
import { HOME_LIKE_COUNT } from "@/common/strings";
import React, { type FC, memo } from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { type RecommendationPost } from "../types/RecommendationPost";
import "intl";
import "intl/locale-data/jsonp/vi";

interface PostItemProps {
    item: RecommendationPost;
    onPress: (id: string, type: PostType) => void;
}

const PostItem: FC<PostItemProps> = ({ item, onPress }) => {
    const onItemPress = (): void => {
        onPress(item.id, item.type);
    };

    return (
        <View className="rounded-lg overflow-hidden" onTouchEnd={onItemPress}>
            <ResourceImage
                className="h-[302] w-[170] bg-black"
                resourceId={item.thumbnails}
            />
            <LinearGradient
                colors={["#00000000", "#00000055"]}
                className="absolute bottom-0 left-0 right-0 h-[100]"
            />
            <View className="absolute bottom-0 left-0 right-0 pb-3 px-2">
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="text-white font-bold mb-[2]"
                >
                    {item.title}
                </Text>
                <Text className="text-white text-xs font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                    }).format(item.likeCount) +
                        " " +
                        HOME_LIKE_COUNT}
                </Text>
            </View>
        </View>
    );
};

export default memo(PostItem);

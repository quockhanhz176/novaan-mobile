import TitleSection from "./TitleSection";
import React, { type FC, memo, type ReactElement, useCallback } from "react";
import PostItem from "./PostItem";
import { FlatList, View } from "react-native";
import { type PostType } from "@/api/post/types/PostResponse";
import { type RecommendationPost } from "../types/RecommendationPost";

interface PostListSectionProps {
    title: string;
    data: RecommendationPost[];
    onItemPress: (id: string, type: PostType) => void;
}

const PostListSection: FC<PostListSectionProps> = ({
    title,
    data,
    onItemPress,
}) => {
    const renderItem = useCallback(
        ({ item }: { item: RecommendationPost }): ReactElement => {
            return <PostItem item={item} onPress={onItemPress} />;
        },
        []
    );

    return data.length > 0 ? (
        <TitleSection title={title}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={data}
                renderItem={renderItem}
                ListHeaderComponent={<View className="w-4" />}
                ListFooterComponent={<View className="w-4" />}
                ItemSeparatorComponent={() => <View className="w-3" />}
            />
        </TitleSection>
    ) : (
        <></>
    );
};

export default memo(PostListSection);

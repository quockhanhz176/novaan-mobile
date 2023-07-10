import { type FC } from "react";
import React, {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
} from "react-native";
import type Post from "../types/Post";
import { Divider } from "react-native-paper";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import IconIon from "react-native-vector-icons/Ionicons";
import { customColors } from "@root/tailwind.config";

interface DetailsProps {
    post: Post;
}

const Details: FC<DetailsProps> = ({ post }: DetailsProps) => {
    return (
        <ScrollView className="w-full h-full bg-white">
            <View className="mt-[114]" />
            <View className="items-center pb-5">
                <Text className="text-2xl">{post.title}</Text>
            </View>
            <Divider bold={true} />
            <View className="py-8 pb-9 items-center">
                <StarRating
                    starSize={15}
                    containerStyle={{ width: 120 }}
                    fullStarColor={customColors.star}
                    emptyStar={"star"}
                    emptyStarColor={customColors.cgrey.platinum}
                    rating={4}
                />
                <Text className="text-cgrey-dim mt-1" style={{ fontSize: 13 }}>
                    377 ratings
                </Text>
                <View className="flex-row justify-center items-center space-x-7 mt-5">
                    <TouchableOpacity>
                        <View className="flex-row space-x-1 items-center">
                            <IconIon
                                name="heart"
                                size={32}
                                color={customColors.heart}
                            />
                            <Text className="text-cgrey-dim font-medium text-sm">
                                140.0K
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View className="flex-row space-x-1 items-center">
                            <IconIon
                                name="bookmark-outline"
                                size={28}
                                color={customColors.cgrey.dim}
                            />
                            <Text className="text-cgrey-dim font-medium text-sm">
                                SAVE
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* space-x-1 doesnt work with this custom view */}
                    {/* <IconLabelButton
                        iconProps={{ name: "heart" }}
                        text="140.0K"
                    />
                    <IconLabelButton
                        iconProps={{
                            name: "bookmark-outline",
                            color: customColors.cgrey.dim,
                            size: 28,
                        }}
                        text="SAVE"
                    /> */}
                </View>
            </View>
            <Divider bold={true} />
            <View className="py-5 px-5">
                <View className="flex-row space-x-5 ">
                    <View className="bg-xanthous w-[70] h-[70] rounded items-center justify-center">
                        {post.creator.avatarUri == null ? (
                            <IconFeather name="user" size={50} />
                        ) : (
                            <Image source={{ uri: post.creator.avatarUri }} />
                        )}
                    </View>
                    <Text className="text-base font-semibold text-csecondary">
                        {post.creator.username}
                    </Text>
                </View>
                <Text className="mt-5 text-lg text-cgrey-dim">
                    &quot;{post.description}&quot;
                </Text>
            </View>
            <Divider bold={true} />
            <View className="py-5">
                <Text></Text>
            </View>
        </ScrollView>
    );
};

export default Details;

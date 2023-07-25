import { memo, type FC } from "react";
import React, { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import { customColors } from "@root/tailwind.config";
import {
    CREATE_RECIPE_COOK_TIME_TITLE,
    REEL_DETAILS_DIFFICULTY_TITLE,
    REEL_DETAILS_INGREDIENTS_TITLE,
    REEL_DETAILS_INSTRUCTIONS_TITLE,
    REEL_DETAILS_SAVE,
    REEL_DETAILS_PREPARE_TIME_TITLE,
    REEL_DETAILS_RATING,
} from "@/common/strings";
import { getDifficultyLabel } from "@/pages/create-post/create-recipe/types/DifficultyItems";
import DetailTime from "./DetailTime";
import IconLabelButton from "@/common/components/IconLabelButton";
import DetailInstruction from "./DetailInstruction";
import ResourceImage from "@/common/components/ResourceImage";
import { getPortionLabel } from "@/pages/create-post/create-recipe/types/PortionTypeItems";
import type Post from "../../types/Post";
import numeral from "numeral";
import type ScrollItemController from "../../types/ScrollItemController";

interface DetailsProps {
    post: Post;
    commentCount: number;
    scrollItemController: ScrollItemController;
}

const Details: FC<DetailsProps> = ({
    post,
    commentCount,
    scrollItemController,
}: DetailsProps) => {
    const {
        liked,
        saved,
        likePressed,
        savePressed,
        showRating: ratingPressed,
    } = scrollItemController;
    const disabledColor = customColors.cgrey.dim;

    return (
        <ScrollView className="w-full h-full bg-white">
            <View className="items-center py-10">
                <Text className="text-2xl text-center">{post.title}</Text>
            </View>
            <Divider bold={true} />
            <View className="py-8 pb-9 items-center">
                <TouchableOpacity
                    onPress={ratingPressed}
                    className="items-center"
                >
                    <StarRating
                        starSize={15}
                        containerStyle={{ width: 120 }}
                        fullStarColor={customColors.star}
                        emptyStar={"star"}
                        disabled
                        emptyStarColor={customColors.cgrey.platinum}
                        rating={4}
                    />
                    <Text
                        className="text-cgrey-dim mt-1"
                        style={{ fontSize: 13 }}
                    >
                        {commentCount} {REEL_DETAILS_RATING}
                    </Text>
                </TouchableOpacity>
                <View className="flex-row justify-center items-center space-x-7 mt-5">
                    <IconLabelButton
                        iconProps={{
                            name: liked ? "heart" : "heart-outline",
                            color: liked ? customColors.heart : disabledColor,
                        }}
                        text={numeral(post.likeCount).format("0 a")}
                        buttonProps={{ onPress: likePressed }}
                    />
                    <IconLabelButton
                        iconProps={{
                            name: saved ? "bookmark" : "bookmark-outline",
                            color: saved ? customColors.save : disabledColor,
                            size: 28,
                        }}
                        text={REEL_DETAILS_SAVE}
                        buttonProps={{ onPress: savePressed }}
                    />
                </View>
            </View>
            <Divider bold={true} />
            <View className="py-5 px-5">
                <View className="flex-row space-x-5 ">
                    <View className="bg-xanthous w-[70] h-[70] rounded items-center justify-center overflow-hidden">
                        {post.creator.avatar == null ||
                        post.creator.avatar === "" ? (
                            <IconFeather name="user" size={50} />
                        ) : (
                            <ResourceImage
                                resourceId={post.creator.avatar}
                                className="h-full w-full"
                            />
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
            {post.type === "recipe" && (
                <View>
                    <Divider bold={true} />
                    <View className="pt-4 pb-6 px-5">
                        <View className="flex-row">
                            <Text className="font-semibold text-lg uppercase">
                                {REEL_DETAILS_DIFFICULTY_TITLE}
                            </Text>
                            <Text className="text-lg">
                                {getDifficultyLabel(post.difficulty)}
                            </Text>
                        </View>
                    </View>
                    <Divider bold={true} />
                    <View className="py-5 mr-3 flex-row flex-between space-x-10 justify-center">
                        <DetailTime
                            title={REEL_DETAILS_PREPARE_TIME_TITLE}
                            time={post.prepTime}
                        />
                        <DetailTime
                            title={CREATE_RECIPE_COOK_TIME_TITLE}
                            time={post.cookTime}
                        />
                    </View>
                    <Divider bold={true} />
                    <View className="pt-5 pb-7 px-5">
                        <Text className="font-semibold text-lg uppercase">
                            {REEL_DETAILS_INGREDIENTS_TITLE}
                        </Text>
                        <Text className="mt-3 pl-4 text-lg">{`${post.portionQuantity.toString()} ${getPortionLabel(
                            post.portionType
                        )}`}</Text>
                        <View className="mt-5 pl-4">
                            {post.ingredients.map((ingredient, index) => (
                                <View key={index} className="flex-row w-full">
                                    <Text className="basis-5/12 text-base mb-1 text-cgrey-dim">
                                        {`${ingredient.amount} ${ingredient.unit}`}
                                    </Text>
                                    <Text className="basis-7/12 text-base text-cgrey-dim">
                                        {ingredient.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Divider bold={true} />
                    <View className="items-center pt-6 pb-9">
                        <Text className="uppercase text-lg font-semibold">
                            {REEL_DETAILS_INSTRUCTIONS_TITLE}
                        </Text>
                    </View>
                    <View>
                        {post.instructions.map(
                            (instruction, index, instructions) => (
                                <DetailInstruction
                                    instruction={instruction}
                                    instructionCount={instructions.length}
                                    key={index}
                                />
                            )
                        )}
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

export default memo(Details);

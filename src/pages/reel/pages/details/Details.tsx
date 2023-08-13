import React, { useContext, type ReactElement, memo, useCallback } from "react";
import { ScrollView, View, Text } from "react-native";
import { Avatar, Divider } from "react-native-paper";
import { customColors } from "@root/tailwind.config";
import {
    CREATE_RECIPE_COOK_TIME_TITLE,
    REEL_DETAILS_DIFFICULTY_TITLE,
    REEL_DETAILS_INGREDIENTS_TITLE,
    REEL_DETAILS_INSTRUCTIONS_TITLE,
    REEL_DETAILS_PREPARE_TIME_TITLE,
} from "@/common/strings";
import { getDifficultyLabel } from "@/pages/create-post/create-recipe/types/DifficultyItems";
import DetailTime from "./components/DetailTime";
import IconLabelButton from "@/common/components/IconLabelButton";
import DetailInstruction from "./components/DetailInstruction";
import ResourceImage from "@/common/components/ResourceImage";
import { getPortionLabel } from "@/pages/create-post/create-recipe/types/PortionTypeItems";
import { ScrollItemContext } from "../../components/scroll-items/ScrollItemv2";
import OverlayLoading from "@/common/components/OverlayLoading";
import StarRating from "react-native-star-rating";
import ViewMoreText from "react-native-view-more-text";

const Details = (): ReactElement => {
    const {
        currentPost,
        likeInfo,
        saved,
        handleLike,
        handleUnlike,
        handleSave,
        handleUnsave,
    } = useContext(ScrollItemContext);

    const handleLikePress = useCallback(() => {
        if (currentPost == null || currentPost.status !== "Approved") {
            return;
        }

        likeInfo.liked ? handleUnlike() : handleLike();
    }, [currentPost, likeInfo.liked]);

    const handleSavePress = useCallback(() => {
        if (currentPost == null || currentPost.status !== "Approved") {
            return;
        }

        saved ? handleUnsave() : handleSave();
    }, [currentPost, saved]);

    if (currentPost == null) {
        return <OverlayLoading />;
    }

    return (
        <ScrollView className="w-full h-full bg-white">
            {/* <View className="flex-row items-center justify-between px-4 py-2">
                <Text className="text-base font-semibold">
                    Chi tiết công thức
                </Text>
                <View className="flex-row items-center">
                    <IconLabelButton
                        iconProps={{
                            name: liked ? "heart" : "heart-outline",
                            color: liked
                                ? customColors.cprimary["300"]
                                : customColors.cgrey.dim,
                            size: 30,
                        }}
                        // text={numeral(currentPost.likeCount).format("0 a")}
                        buttonProps={{ onPress: handleLike }}
                    />
                    <IconLabelButton
                        iconProps={{
                            name: saved ? "bookmark" : "bookmark-outline",
                            color: saved
                                ? customColors.save
                                : customColors.cgrey.dim,
                            size: 30,
                        }}
                        // text={REEL_DETAILS_SAVE}
                        buttonProps={{ onPress: handleSave }}
                    />
                </View>
            </View> */}
            <Divider bold />
            <View className="flex-row justify-between items-center mt-8 mx-4">
                <Text className="text-xl flex-1 text-justify">
                    {currentPost.title}
                </Text>
                <View className="flex-row items-center space-x-2 ml-4">
                    <IconLabelButton
                        iconProps={{
                            name: likeInfo.liked ? "heart" : "heart-outline",
                            color: likeInfo.liked
                                ? customColors.heart
                                : customColors.cgrey.dim,
                            size: 26,
                        }}
                        // text={numeral(currentPost.likeCount).format("0 a")}
                        buttonProps={{
                            onPress: handleLikePress,
                        }}
                    />
                    <IconLabelButton
                        iconProps={{
                            name: saved ? "bookmark" : "bookmark-outline",
                            color: saved
                                ? customColors.save
                                : customColors.cgrey.dim,
                            size: 26,
                        }}
                        // text={REEL_DETAILS_SAVE}
                        buttonProps={{ onPress: handleSavePress }}
                    />
                </View>
            </View>
            <View className="flex-row space-x-2 items-center mt-2 mx-4">
                <View className="w-1/3">
                    <StarRating
                        starSize={20}
                        fullStarColor={customColors.cprimary["300"]}
                        emptyStar={"star"}
                        disabled
                        emptyStarColor={customColors.cgrey.platinum}
                        rating={currentPost.averageRating}
                    />
                </View>
                <Text className="text-base text-cprimary-300">
                    {isNaN(currentPost.averageRating)
                        ? 0
                        : currentPost.averageRating.toFixed(1)}
                </Text>
                <Text className="text-base text-cprimary-300 ml-2">
                    ({currentPost.ratingCount})
                </Text>
            </View>
            <View className="flex-row justify-between items-center mx-4 mt-8">
                <View className="flex-row justify-start items-center">
                    <View>
                        {currentPost.creator.avatar == null ||
                        currentPost.creator.avatar === "" ? (
                            <Avatar.Icon icon="account-outline" size={36} />
                        ) : (
                            <ResourceImage
                                resourceId={currentPost.creator.avatar}
                                className="h-full w-full"
                            />
                        )}
                    </View>
                    <View>
                        <Text className="text-base font-semibold text-cprimary-300 ml-2 items-center">
                            {currentPost.creator.username}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="mx-4 mt-2">
                <ViewMoreText
                    numberOfLines={2}
                    renderViewMore={(onPress) => (
                        <Text
                            onPress={onPress}
                            className="text-lg text-gray-500 italic text-justify"
                        >
                            Xem thêm
                        </Text>
                    )}
                    renderViewLess={(onPress) => (
                        <Text
                            onPress={onPress}
                            className="text-lg text-gray-500 italic text-justify"
                        >
                            Ẩn bớt
                        </Text>
                    )}
                >
                    <Text className="text-lg text-gray-700 italic text-justify">
                        &quot;{currentPost.description}&quot;
                    </Text>
                </ViewMoreText>
            </View>
            {currentPost.type === "recipe" && (
                <View className="mt-8">
                    <Divider bold={true} />
                    <View className="my-4 mx-4 flex-row space-x-4 justify-center">
                        <View className="items-center space-y-3">
                            <Text className="text-base font-normal">
                                {REEL_DETAILS_DIFFICULTY_TITLE}
                            </Text>
                            <Text className="text-lg font-semibold text-cprimary-300">
                                {getDifficultyLabel(currentPost.difficulty)}
                            </Text>
                        </View>
                        <DetailTime
                            title={REEL_DETAILS_PREPARE_TIME_TITLE}
                            time={currentPost.prepTime}
                        />
                        <DetailTime
                            title={CREATE_RECIPE_COOK_TIME_TITLE}
                            time={currentPost.cookTime}
                        />
                    </View>
                    <Divider bold={true} />
                    <View className="mx-4 my-8">
                        <Text className="font-semibold text-lg uppercase">
                            {REEL_DETAILS_INGREDIENTS_TITLE}
                        </Text>
                        <Text className="mt-3 pl-4 text-lg">{`${currentPost.portionQuantity.toString()} ${getPortionLabel(
                            currentPost.portionType
                        )}`}</Text>
                        <View className="mt-5 pl-4">
                            {currentPost.ingredients.map(
                                (ingredient, index) => (
                                    <View
                                        key={index}
                                        className="flex-row w-full"
                                    >
                                        <Text className="basis-5/12 text-base mb-1 text-cgrey-dim">
                                            {`${ingredient.amount} ${ingredient.unit}`}
                                        </Text>
                                        <Text className="basis-7/12 text-base text-cgrey-dim">
                                            {ingredient.name}
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    </View>
                    <Divider bold={true} />
                    <View className="mx-4 my-4">
                        <Text className="uppercase text-lg font-semibold">
                            {REEL_DETAILS_INSTRUCTIONS_TITLE}
                        </Text>
                    </View>
                    <View>
                        {currentPost.instructions.map(
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

import type AutocompeletePostResponse from "@/api/search/types/AutocompletePostResponse";
import ResourceImage from "@/common/components/ResourceImage";
import { BASIC_SEARCH_RECIPE, BASIC_SEARCH_TIP } from "@/common/strings";
import React, { memo, type FC } from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface AutocompleteItemProps {
    item: AutocompeletePostResponse;
    onItemPressed: (item: AutocompeletePostResponse) => void;
}

const AutocompleteItem: FC<AutocompleteItemProps> = ({
    item,
    onItemPressed,
}) => {
    const onPressed = (): void => {
        onItemPressed(item);
    };

    return (
        <TouchableOpacity
            onPress={onPressed}
            className="px-4 py-1 bg-white"
            // underlayColor={customColors.ctertiary}
        >
            <View className="flex-row space-x-3">
                <ResourceImage
                    resourceId={item.thumbnailImage}
                    className="rounded-md h-[50] w-[50] overflow-hidden"
                    resizeMode="cover"
                />
                <View className="justify-center flex-1">
                    <Text
                        className="text-cgrey-dim text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.title}
                    </Text>
                    <Text className="text-cgrey-grey text-xs">
                        {item.type === "Recipe"
                            ? BASIC_SEARCH_RECIPE
                            : BASIC_SEARCH_TIP}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default memo(AutocompleteItem);

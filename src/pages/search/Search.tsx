import React, { type FC } from "react";
import { View } from "react-native";
import RecipeTipSearch from "./components/RecipeTipSearch";

const Search: FC = () => {
    return (
        <View className="flex-1">
            <RecipeTipSearch />
        </View>
    );
};

export default Search;

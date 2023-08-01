import React, { type FC } from "react";
import Swiper from "react-native-swiper";
import RecipeTipSearch from "./basic-search/RecipeTipSearch";
import AdvancedSearch from "./advanced-search/AdvancedSearch";
import { type ReelParams } from "../Search";

interface SearchSwiperProps {
    setReelParams?: (value: ReelParams) => void;
    showReel?: () => void;
}

const SearchSwiper: FC<SearchSwiperProps> = ({ setReelParams, showReel }) => {
    return (
        <Swiper
            showsPagination={false}
            loop={false}
            index={0}
        >
            <RecipeTipSearch
                setReelParams={setReelParams}
                showReel={showReel}
            />
            <AdvancedSearch setReelParams={setReelParams} showReel={showReel} />
        </Swiper>
    );
};

export default SearchSwiper;

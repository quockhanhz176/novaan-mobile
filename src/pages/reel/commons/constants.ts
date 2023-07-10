import { BOTTOM_NAV_HEIGHT } from "@/common/constants";
import { windowHeight } from "@/common/utils";

// The additional 3 make the video view not gradually shifting up or down (on my device ¯\_(ツ)_/¯)
// (any (8*x + 3) with (x being 0, 1, 2, 3) works) (why?)
export const SCROLL_ITEM_HEIGHT = windowHeight - BOTTOM_NAV_HEIGHT + 3;

console.log(
    "scrollItemHeight: " +
        SCROLL_ITEM_HEIGHT.toString() +
        " - windowHeight: " +
        windowHeight.toString()
);

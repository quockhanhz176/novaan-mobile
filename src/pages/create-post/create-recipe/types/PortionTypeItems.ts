import { PORTION_PIECE, PORTION_SERVING } from "@/common/strings";

const portionTypeItems = [
    { label: PORTION_SERVING, value: 0 },
    { label: PORTION_PIECE, value: 1 },
];

export const getPortionLabel = (value: number): string => {
    return (
        portionTypeItems.find((item) => item.value === value)?.label ??
        portionTypeItems[0].label
    );
};

export default portionTypeItems;

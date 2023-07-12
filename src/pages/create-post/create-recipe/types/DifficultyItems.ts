import {
    DIFFICULTY_EASY,
    DIFFICULTY_HARD,
    DIFFICULTY_MEDIUM,
} from "@/common/strings";

const difficultyItems = [
    { label: DIFFICULTY_EASY, value: 0 },
    { label: DIFFICULTY_MEDIUM, value: 1 },
    { label: DIFFICULTY_HARD, value: 2 },
];

export const getDifficultyLabel = (value: number): string => {
    return (
        difficultyItems.find((item) => item.value === value)?.label ??
        difficultyItems[0].label
    );
};

export default difficultyItems;

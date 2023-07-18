import type moment from "moment";

export default interface RecipeTime {
    hour: number;
    minute: number;
}

export const getRecipeTime = (duration: moment.Duration): RecipeTime => ({
    hour: duration.days() * 24 + duration.hours(),
    minute: duration.minutes(),
});

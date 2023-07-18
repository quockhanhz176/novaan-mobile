import { type TDVInformation } from "../../common/types/TDVParams";
import { type AdditionalRecipeInformation } from "./RecipeParams";

type RecipeSubmission = TDVInformation & AdditionalRecipeInformation;

export default RecipeSubmission;

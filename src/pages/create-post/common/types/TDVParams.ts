import { type Context } from "react";
import { type Asset } from "react-native-image-picker";
import { recipeParams } from "../../create-recipe/types/RecipeParams";
import { tipTDVParams } from "../../create-tip/types/TipParams";
import { type Setter } from "@/common/utils";

export interface TDVInformation {
    title: string;
    description: string;
    video: Asset | null;
}

export type TDVStates = TDVInformation & Setter<TDVInformation>;

// props required for the TitleDescriptionVideo screen
export interface TDVParams<T extends TDVStates> {
    labels: {
        thank: string;
        titleLabel: string;
        titlePlaceHolder: string;
        descriptionLabel: string;
        descriptionPlaceholder: string;
        mediaLabel: string;
        mediaButtonText: string;
    };
    messages: {
        wrongFileLengthError: string;
        wrongFileSizeError: string;
        compressingMessage: string;
        successMessage: string;
        failMessage: string;
        fail2ndMessage: string;
    };
    states: Context<T>;
}

const TDVParamTypes = {
    recipeParams,
    tipTDVParams,
};

export default TDVParamTypes;

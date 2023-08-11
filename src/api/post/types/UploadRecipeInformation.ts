export default interface UploadRecipeInformation {
    title: string;
    description: string;
    videoUri: string;
    videoExtension: string;
    thumbnailUri: string;
    thumbnailExtension: string;
    difficulty: number;
    portionType: number;
    portionQuantity: number;
    prepTime: string;
    cookTime: string;
    instructions: InstructionInformation[];
    ingredients: IngredientInformation[];
    diets: string[];
    mealTypes: string[];
    cuisines: string[];
    allergens: string[];
}

export interface EditRecipeInformation
    extends Omit<
        UploadRecipeInformation,
        "videoExtension" | "thumbnailExtension"
    > {
    videoExtension?: string;
    thumbnailExtension?: string;
}

export interface EditRecipeInformation
    extends Omit<UploadRecipeInformation, "videoExtension"> {
    videoExtension?: string;
}

export interface InstructionInformation {
    step: number;
    description: string;
    image?: {
        uri: string;
        extension: string;
    };
}

export interface IngredientInformation {
    name: string;
    amount: number;
    unit: string;
}

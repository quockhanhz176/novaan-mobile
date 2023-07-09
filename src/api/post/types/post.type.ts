export interface PostInfo {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    video: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
    adminComments: AdminComment[];
}

export interface RecipeInfo extends PostInfo {
    difficulty: Difficulty;
    portionQuantity: number;
    portionType: PortionType;
    prepTime: string;
    cookTime: string;
    instructions: Instruction[];
    ingredients: Ingredient[];
}

export interface TipsInfo extends PostInfo {}

export enum Difficulty {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

export enum PortionType {
    Servings = "Servings",
    Pieces = "Pieces",
}

export interface Instruction {
    step: number;
    description: string;
    image: string;
}

export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

export enum Status {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Reported = "Reported",
}

export interface AdminComment {
    id: string;
    comment: string;
    createdAt: string;
}

export type SubmissionType = "recipe" | "tips";

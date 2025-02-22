import { MealType } from "./recipe.model";

export interface IRecipeListItem {
    id: string;
    name: string;
    duration: number;
    mealType: MealType;
}

export interface IRecipeDto {
    id: string;
    name: string;
    duration: number;
    products: IRecipeProductDto[];
    steps: IStepDto[];
}

export interface IRecipeProductDto {
    id: string;
    name: string;
}

export interface IStepDto {
    order: number;
    content: string;
    productIds: string[];
    duration: number;
}
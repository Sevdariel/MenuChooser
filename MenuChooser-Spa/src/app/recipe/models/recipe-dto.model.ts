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
    createdBy: string;
    updatedBy: string;
    mealType: MealType;
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

export interface IUpdateRecipeDto {
    id: string;
    name: string;
    productIds: string[];
    duration: number;
    steps: IStepDto[];
    updatedBy: string;
}
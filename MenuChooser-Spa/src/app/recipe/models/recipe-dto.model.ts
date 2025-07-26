import { IProduct } from "../../product/models/product.model";
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
    product: IProduct;
    quantity: number;
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

export interface ICreateRecipeDto {
    name: string;
    duration: number;
    productIds: string[];
    steps: IStepDto[];
    mealType: MealType;
    createdBy: string;
}
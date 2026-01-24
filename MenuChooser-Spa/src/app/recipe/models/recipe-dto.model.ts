import { IProduct } from "../../product/models/product.model";
import { MealType, Unit } from "./recipe.model";

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
    products: IGetRecipeProductDto[];
    steps: IStepDto[];
    createdBy: string;
    updatedBy: string;
    mealType: MealType;
}

export interface IGetRecipeProductDto {
    product: IProduct;
    quantity: number;
    unit: Unit;
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
    recipeProducts: ISaveRecipeProductDto[];
    steps: IStepDto[];
    mealType: MealType;
    createdBy: string;
}

export interface ISaveRecipeProductDto {
    productId: string;
    quantity: number;
    unit: Unit;
}

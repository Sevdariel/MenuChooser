import { IProduct } from "../../product/models/product.model";

export interface IRecipe {
    id: string;
    name: string;
    duration: number;
    products: IProduct[];
    steps: IStep[];
    createdBy: string;
    updatedBy: string;
}

export interface IStep {
    order: number;
    content: string;
    products: IProduct[];
    duration: number;
}

export enum MealType {
    Breakfast = 0,
    Dinner,
    Lunch,
    Appetizer,
    Dessert
}
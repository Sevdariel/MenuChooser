import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IProduct } from "../../product/models/product.model";

export interface IRecipe {
    id: string;
    name: string;
    duration: number;
    products: IRecipeProduct[];
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

export interface IRecipeProduct {
    id: string;
    name: string;
}

export enum MealType {
    Breakfast = 0,
    Dinner,
    Lunch,
    Appetizer,
    Dessert
}

export type RecipeFormType = {
    name: FormControl<string | null>;
    products: FormArray<FormGroup<RecipeProductFormType>>;
    steps: FormControl<IStep[] | null>;
    duration: FormControl<number | null>;
}

export type RecipeProductFormType = {
    id: FormControl<string | null>;
    name: FormControl<string | null>;
}
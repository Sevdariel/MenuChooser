import { FormControl } from '@angular/forms';
import { IProduct } from '../../product/models/product.model';

export interface IRecipe {
  id: string;
  name: string;
  duration: number;
  products: IRecipeProduct[];
  steps: IStep[];
  createdBy: string;
  updatedBy: string;
  mealType?: MealType;
  servings?: number;
  caloriesPerServing?: number;
  tags?: string[];
}

export interface IStep {
  order: number;
  content: string;
  products: IRecipeProduct[];
  duration: number;
}

export interface IRecipeProduct {
  product: IProduct;
  quantity: number;
  unit: Unit;
}

export interface IRecipeForm {
  name: string | null;
  duration: number | null;
  products: IRecipeProduct[] | null;
  steps: IStep[] | null;
  mealType?: MealType | null;
  servings?: number | null;
  caloriesPerServing?: number | null;
  tags?: string[] | null;
}

export enum Unit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
  PIECE = 'szt',
}

export const defaultUnit = Unit.GRAM;

export enum MealType {
  Breakfast = 0,
  Dinner,
  Lunch,
  Appetizer,
  Dessert,
}

export type RecipeFormType = {
  name: FormControl<string | null>;
  products: FormControl<IRecipeProduct[] | null>;
  steps: FormControl<IStep[] | null>;
  duration: FormControl<number | null>;
  mealType?: FormControl<MealType | null>;
  servings?: FormControl<number | null>;
  caloriesPerServing?: FormControl<number | null>;
  tags?: FormControl<string[] | null>;
};

export type RecipeProductFormType = {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
};

export type RecipeStepsFormType = {
  order: FormControl<number | null>;
  content: FormControl<string | null>;
  duration: FormControl<number | null>;
  products: FormControl<IRecipeProduct[] | null>;
};

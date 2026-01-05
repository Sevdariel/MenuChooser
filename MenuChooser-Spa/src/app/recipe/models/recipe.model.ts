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
  unit: string;
}

export enum Unit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
  PIECE = 'szt',
}

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

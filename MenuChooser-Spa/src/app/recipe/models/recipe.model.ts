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
  tags?: RecipeTag[];
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
  tags?: RecipeTag[] | null;
}

export enum Unit {
  GRAM = 'Gram',
  KILOGRAM = 'Kilogram',
  MILLILITER = 'Milliliter',
  LITER = 'Liter',
  PIECE = 'Piece',
}

export const defaultUnit = Unit.GRAM;

/** Map from API response value (EnumMember) to frontend Unit enum */
export function parseUnitFromApi(value: string): Unit {
  switch (value) {
    case 'g': case 'Gram': return Unit.GRAM;
    case 'kg': case 'Kilogram': return Unit.KILOGRAM;
    case 'ml': case 'Milliliter': return Unit.MILLILITER;
    case 'l': case 'Liter': return Unit.LITER;
    case 'szt': case 'Piece': return Unit.PIECE;
    default: return Unit.GRAM;
  }
}

export enum MealType {
  Breakfast = 'breakfast',
  Dinner = 'dinner',
  Lunch = 'lunch',
  Appetizer = 'appetizer',
  Dessert = 'dessert',
}

export enum RecipeTag {
  Vegetarian = 'vegetarian',
  Vegan = 'vegan',
  GlutenFree = 'glutenFree',
  Italian = 'italian',
  Spicy = 'spicy',
  Quick = 'quick',
  Healthy = 'healthy',
}

export type RecipeFormType = {
  name: FormControl<string | null>;
  products: FormControl<IRecipeProduct[] | null>;
  steps: FormControl<IStep[] | null>;
  duration: FormControl<number | null>;
  mealType?: FormControl<MealType | null>;
  servings?: FormControl<number | null>;
  caloriesPerServing?: FormControl<number | null>;
  tags?: FormControl<RecipeTag[] | null>;
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

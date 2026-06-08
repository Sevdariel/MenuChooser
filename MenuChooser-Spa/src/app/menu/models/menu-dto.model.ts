import { RecipeTag } from '../../recipe/models/recipe.model';
import { MealType } from './menu.model';

export interface MenuGenerateRequest {
  meals: MealConfigDto[];
}

export interface MealConfigDto {
  type: MealType;
  name: string;
  time: string;
  enabled: boolean;
}

export interface MenuPreviewDto {
  id: string;
  weekStart: string;
  days: DailyMenuDto[];
}

export interface DailyMenuDto {
  date: string;
  meals: MealSlotDto[];
}

export interface MealSlotDto {
  type: MealType;
  name: string;
  time: string;
  recipe: RecipePreviewDto;
}

export interface RecipePreviewDto {
  id: string;
  name: string;
  duration: number;
  mealType: MealType | null;
  tags: RecipeTag[];
  caloriesPerServing: number | null;
  description: string | null;
  ingredients: string[];
}

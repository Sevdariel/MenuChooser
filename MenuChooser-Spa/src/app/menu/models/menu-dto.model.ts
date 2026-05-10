import { MealType } from './menu.model';

export interface MenuGenerateRequest {
  meals: MealConfigDto[];
}

export interface MealConfigDto {
  mealType: MealType;
  name: string;
  time: string;
  enabled: boolean;
}

import { MealType } from "./recipe.model";

export interface IRecipeListItem {
    id: string;
    name: string;
    duration: number;
    mealType: MealType;
}
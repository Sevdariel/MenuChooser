import { IRecipeListItem } from './recipe-dto.model';
import { IRecipe, MealType } from './recipe.model';

export const defaultRecipe: IRecipe = {
  createdBy: '',
  duration: 0,
  id: '',
  name: '',
  products: [],
  steps: [],
  updatedBy: '',
};

export const defaultRecipeListItem: IRecipeListItem = {
  id: '',
  name: '',
  duration: 0,
  mealType: MealType.Appetizer,
};

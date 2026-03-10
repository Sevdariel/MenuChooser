import { IRecipe } from '../../../../recipe/models/recipe.model';

export interface RecipeFormStateModel {
  recipe: IRecipe | null;
  isLoading: boolean;
  error: string | null;
}

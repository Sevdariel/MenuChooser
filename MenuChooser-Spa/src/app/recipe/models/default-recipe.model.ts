import { IRecipe, IRecipeForm } from './recipe.model';

export const defaultRecipe: IRecipe = {
  createdBy: '',
  duration: 0,
  id: '',
  name: '',
  products: [],
  steps: [],
  updatedBy: '',
};

export const defaultRecipeForm: IRecipeForm = {
  name: '',
  duration: 0,
  products: [],
  steps: [],
};

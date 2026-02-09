import { IRecipeForm, IRecipeProductForm } from './recipe-forms.model';
import { IRecipe, Unit } from './recipe.model';

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

export const defaultRecipeProductForm: IRecipeProductForm = {
  product: {
    id: '',
    name: '',
    producent: '',
    createdBy: '',
    updatedBy: '',
  },
  quantity: 0,
  unit: Unit.GRAM,
};

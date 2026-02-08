import { IRecipeProduct, IStep } from './recipe.model';

export interface IRecipeForm {
  name: string;
  products: IRecipeProduct[];
  steps: IStep[];
  duration: number;
}

import { IProduct } from '../../product/models/product.model';
import { IRecipeProduct, IStep, Unit } from './recipe.model';

export interface IRecipeForm {
  name: string;
  products: IRecipeProduct[];
  steps: IStep[];
  duration: number;
}

export interface IRecipeProductForm {
  product: IProduct;
  quantity: number;
  unit: Unit;
}

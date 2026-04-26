import { ProductCategory } from './product.model';

export interface IProductForm {
    name: string;
    producent: string;
    sub: string;
    emoji: string;
    category: ProductCategory;
    unit: string;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
}
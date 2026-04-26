import { ProductCategory } from './product.model';

export interface IUpdateProductDto {
    id: string;
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
    createdBy: string;
    updatedBy: string;
}

export interface IAddProductDto {
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
    createdBy: string;
}
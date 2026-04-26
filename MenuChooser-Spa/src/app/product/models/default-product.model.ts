import { IProduct, ProductCategory } from "./product.model";

export const defaultProduct: IProduct = {
    createdBy: '',
    id: '',
    name: '',
    producent: '',
    sub: '',
    emoji: '📦',
    category: ProductCategory.OTHER,
    unit: 'g',
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    updatedBy: '',
}
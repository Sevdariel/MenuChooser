import { FormControl } from "@angular/forms";

export enum ProductCategory {
  VEGETABLES = 'vegetables',
  MEAT = 'meat',
  DAIRY = 'dairy',
  GRAINS = 'grains',
  OTHER = 'other',
}

export interface IProduct {
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

export type ProductFormType = {
    name: FormControl<string | null>;
    producent: FormControl<string | null>;
    sub: FormControl<string | null>;
    emoji: FormControl<string | null>;
    category: FormControl<ProductCategory | null>;
    unit: FormControl<string | null>;
    kcal: FormControl<number | null>;
    protein: FormControl<number | null>;
    carbs: FormControl<number | null>;
    fat: FormControl<number | null>;
}

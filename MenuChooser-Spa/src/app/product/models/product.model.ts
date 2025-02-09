import { FormControl } from "@angular/forms";

export interface IProduct {
    id: string;
    name: string;
    producent: string;
    createdBy: string;
    updatedBy: string;
}

export type ProductFormType = {
    name: FormControl<string | null>;
    producent: FormControl<string | null>;
}

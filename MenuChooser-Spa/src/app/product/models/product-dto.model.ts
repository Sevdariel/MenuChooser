export interface IUpdateProductDto {
    id: string;
    name: string;
    producent: string;
    createdBy: string;
    updatedBy: string;
}

export interface IAddProductDto {
    name: string;
    producent: string;
    createdBy: string;
}
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '../services/product.service';
import { IProduct } from '../models/product.model';

export const productResolver: ResolveFn<IProduct> = (route, state) => {
  const productService = inject(ProductService);

  return productService.getProduct(route.params['id']);
};

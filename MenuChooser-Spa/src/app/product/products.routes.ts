import { Routes } from '@angular/router';
import { productResolver } from './resolvers/product.resolver';
import { productsResolver } from './resolvers/products.resolver';
import { AddProductComponent } from './views/add-product/add-product.component';
import { ProductComponent } from './views/product/product.component';
import { ProductsListComponent } from './views/products-list/products-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
    resolve: { products: productsResolver },
  },
  {
    path: 'new',
    component: AddProductComponent,
  },
  {
    path: ':id',
    component: ProductComponent,
    resolve: { product: productResolver },
  },
];

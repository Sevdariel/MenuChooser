import { Routes } from '@angular/router';
import { productResolver } from './resolvers/product.resolver';
import { productsResolver } from './resolvers/products.resolver';
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
    component: ProductComponent,
  },
  {
    path: ':id',
    component: ProductComponent,
    resolve: { product: productResolver },
  },
];

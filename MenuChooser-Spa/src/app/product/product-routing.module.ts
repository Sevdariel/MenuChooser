import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './views/products-list/products-list.component';
import { productsResolver } from './resolvers/products.resolver';
import { ProductComponent } from './views/product/product.component';
import { productResolver } from './resolvers/product.resolver';
import { AddProductComponent } from './views/add-product/add-product.component';

const routes: Routes = [
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

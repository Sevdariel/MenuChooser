import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { productsResolver } from './resolvers/products.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
    resolve: { products: productsResolver },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

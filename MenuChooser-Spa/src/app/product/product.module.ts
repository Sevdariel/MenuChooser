import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductsListComponent } from './views/products-list/products-list.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { ProductComponent } from './views/product/product.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SvgIconComponent,
    ReactiveFormsModule,
  ]
})
export class ProductModule { }

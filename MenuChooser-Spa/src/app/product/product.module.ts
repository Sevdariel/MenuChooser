import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { SvgIconComponent } from 'angular-svg-icon';


@NgModule({
  declarations: [
    ProductsListComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SvgIconComponent,
  ]
})
export class ProductModule { }

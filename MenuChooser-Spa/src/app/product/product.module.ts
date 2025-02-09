import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { DrawerModule } from 'primeng/drawer';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './views/product/product.component';
import { ProductsListComponent } from './views/products-list/products-list.component';

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
    DrawerModule,
  ]
})
export class ProductModule { }

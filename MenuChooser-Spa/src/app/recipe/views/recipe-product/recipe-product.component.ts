import { Component, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { IProduct } from '../../../product/models/product.model';

@Component({
  selector: 'mc-recipe-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './recipe-product.component.html',
  styleUrl: './recipe-product.component.scss'
})
export class RecipeProductComponent {
  public products = input<IProduct[]>([]);
  @Output() save = new EventEmitter<{ product: IProduct | null; quantity: number }>();
  @Output() cancel = new EventEmitter<void>();

  selectedProduct: IProduct | null = null;
  quantity: number = 1;
  filteredProducts: IProduct[] = [];

  filterProducts(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredProducts = this.products().filter(product => 
      product.name.toLowerCase().includes(query)
    );
  }

  onSave() {
    if (this.selectedProduct && this.quantity > 0) {
      this.save.emit({
        product: this.selectedProduct,
        quantity: this.quantity
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}

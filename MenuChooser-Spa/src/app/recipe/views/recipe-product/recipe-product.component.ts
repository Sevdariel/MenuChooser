import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, model, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { tap } from 'rxjs';
import { IProduct } from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { IRecipeProduct } from '../../models/recipe.model';

@Component({
  selector: 'mc-recipe-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './recipe-product.component.html',
  styleUrl: './recipe-product.component.scss'
})
export class RecipeProductComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  public product = model<IRecipeProduct | null>(null);
  public closeDrawer = output<IRecipeProduct | null>();
  public suggestionProducts = signal<IProduct[]>([]);

  public productForm!: FormGroup;

  public ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      product: [this.product()?.product, Validators.required],
      quantity: [this.product()?.quantity, [Validators.required, Validators.min(0.01)]]
    });
  }

  onSave() {
    if (this.productForm.valid) {
      console.log('this.productForm', this.productForm.getRawValue());
      this.closeDrawer.emit(this.productForm.getRawValue());
    }
  }

  public search(event: any) {
    this.productService.getFilteredProducts(event.query).pipe(
      tap(products => this.suggestionProducts.set(products)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}

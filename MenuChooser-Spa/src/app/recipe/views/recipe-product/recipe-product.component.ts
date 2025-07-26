import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { IProduct } from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { IRecipeProduct } from '../../models/recipe.model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

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
  public save = output<IRecipeProduct>();
  public cancel = output<void>();
  public suggestionProducts = signal<IProduct[]>([]);

  public productForm: FormGroup = this.formBuilder.group({
    product: [null, Validators.required],
    quantity: [null, [Validators.required, Validators.min(0.01)]]
  });

  public ngOnInit(): void {
    this.initForm();
    this.setupFormValueChanges();
  }

  onSave() {
    if (this.productForm.valid) {
      this.save.emit({
        product: this.productForm.value.product,
        quantity: this.productForm.value.quantity
      });
    } else {
      // Mark all fields as touched to show validation messages
      this.productForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  public search(event: any) {
    this.productService.getFilteredProducts(event.query).pipe(
      tap(products => this.suggestionProducts.set(products)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private initForm(): void {
    // Set initial values if product input is provided
    if (this.product()) {
      this.productForm.patchValue({
        product: this.product()?.product || null,
        quantity: this.product()?.quantity || null
      });
    }
  }

  private setupFormValueChanges(): void {
    this.productForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      if (this.productForm.valid && value.product && value.quantity) {
        this.product.set({
          product: value.product,
          quantity: value.quantity
        });
      }
    });
  }
}

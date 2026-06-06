import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/authorization/auth.service';
import { defaultProduct } from '../../models/default-product.model';
import { IUpdateProductDto } from '../../models/product-dto.model';
import { IProductForm } from '../../models/product-form.model';
import { IProduct } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'mc-product-edit',
  imports: [ButtonModule, FloatLabel, ReactiveFormsModule, InputTextModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  public product = model<IProduct>(defaultProduct);
  public saved = output<IUpdateProductDto>();

  protected productForm!: FormGroup;

  constructor() {
    this.productForm = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      producent: this.formBuilder.control('', Validators.required),
      sub: this.formBuilder.control(''),
      emoji: this.formBuilder.control(''),
      category: this.formBuilder.control(ProductCategory.OTHER),
      unit: this.formBuilder.control(''),
      kcal: this.formBuilder.control(0),
      protein: this.formBuilder.control(0),
      carbs: this.formBuilder.control(0),
      fat: this.formBuilder.control(0),
    });

    effect(() => {
      const currentProduct = this.product();
      this.productForm.patchValue({
        name: currentProduct.name,
        producent: currentProduct.producent,
        sub: currentProduct.sub,
        emoji: currentProduct.emoji,
        category: currentProduct.category,
        unit: currentProduct.unit,
        kcal: currentProduct.kcal,
        protein: currentProduct.protein,
        carbs: currentProduct.carbs,
        fat: currentProduct.fat,
      });
    });
  }

  protected save(event: Event) {
    event.preventDefault();

    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.getRawValue();
    const updateProductDto: IUpdateProductDto = {
      createdBy: this.product().createdBy,
      id: this.product().id,
      name: formValue.name,
      producent: formValue.producent,
      updatedBy: this.authService.loggedUser()!.username,
      sub: formValue.sub,
      emoji: formValue.emoji,
      category: formValue.category,
      unit: formValue.unit,
      kcal: formValue.kcal,
      protein: formValue.protein,
      carbs: formValue.carbs,
      fat: formValue.fat,
    };

    this.productService
      .updateProduct(updateProductDto)
      .pipe(
        tap(() => this.saved.emit(updateProductDto)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}

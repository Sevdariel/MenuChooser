import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/authorization/auth.service';
import { defaultProduct } from '../../models/default-product.model';
import { IUpdateProductDto } from '../../models/product-dto.model';
import { IProductForm } from '../../models/product-form.model';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'mc-product-edit',
  imports: [ButtonModule, FloatLabel, FormField, InputTextModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public product = input(defaultProduct);
  public saved = output<IUpdateProductDto>();
  protected productModel = signal<IProductForm>({
    name: '',
    producent: '',
    sub: '',
    emoji: '',
    category: ProductCategory.OTHER,
    unit: '',
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  protected signalForm = form(this.productModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.producent);
  });

  public save(event: Event) {
    event.preventDefault();
    
    const updateProductDto: IUpdateProductDto = {
      createdBy: this.product().createdBy,
      id: this.product().id,
      name: this.productModel().name,
      producent: this.productModel().producent,
      updatedBy: this.authService.loggedUser()!.username,
      sub: this.productModel().sub,
      emoji: this.productModel().emoji,
      category: this.productModel().category,
      unit: this.productModel().unit,
      kcal: this.productModel().kcal,
      protein: this.productModel().protein,
      carbs: this.productModel().carbs,
      fat: this.productModel().fat,
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

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/authorization/auth.service';
import { IAddProductDto } from '../../models/product-dto.model';
import { IProductForm } from '../../models/product-form.model';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'mc-add-product',
  imports: [
    InputTextModule,
    FloatLabel,
    ButtonModule,
    RouterModule,
    FormField,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductComponent {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

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

  public add(event: Event) {
    event.preventDefault();
    const addProductDto: IAddProductDto = {
      createdBy: this.authService.loggedUser()!.username,
      name: this.productModel().name,
      producent: this.productModel().producent,
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
      .addProduct(addProductDto)
      .pipe(
        tap((newProduct) =>
          this.router.navigate([`/products/${newProduct.id}`]),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}

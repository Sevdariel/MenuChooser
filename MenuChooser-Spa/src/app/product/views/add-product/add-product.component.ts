import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/authorization/auth.service';
import { IAddProductDto } from '../../models/product-dto.model';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'mc-add-product',
  imports: [
    ButtonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductComponent {
  public readonly ProductCategory = ProductCategory;
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly router = inject(Router);
  public readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

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
  }

  protected cancel() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  protected add(event: Event) {
    event.preventDefault();

    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.getRawValue();
    const addProductDto: IAddProductDto = {
      createdBy: this.authService.loggedUser()!.username,
      name: formValue.name,
      producent: formValue.producent,
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

import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/authorization/auth.service';
import { defaultProduct } from '../../models/default-product.model';
import { IUpdateProductDto } from '../../models/product-dto.model';
import { ProductFormType } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'mc-product-edit',
  imports: [
    ButtonModule,
    FloatLabel,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public product = input(defaultProduct);
  public saved = output<IUpdateProductDto>();

  public formGroup!: FormGroup<ProductFormType>;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(this.product().name),
      producent: new FormControl(this.product().producent),
    })
  }

  public save() {
    const updateProductDto: IUpdateProductDto = {
      createdBy: this.product().createdBy,
      id: this.product().id,
      name: this.formGroup.controls.name.value!,
      producent: this.formGroup.controls.producent.value!,
      updatedBy: this.authService.loggedUser()!.username,
    }

    this.productService.updateProduct(updateProductDto).pipe(
      tap(() => this.saved.emit(updateProductDto)),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}

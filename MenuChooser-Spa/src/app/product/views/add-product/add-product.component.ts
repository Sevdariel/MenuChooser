import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/authorization/auth.service';
import { IAddProductDto } from '../../models/product-dto.model';
import { ProductFormType } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { tap } from 'rxjs';

@Component({
  selector: 'mc-add-product',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public formGroup!: FormGroup<ProductFormType>;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(),
      producent: new FormControl(),
    });
  }

  public add() {
    const addProductDto: IAddProductDto = {
      createdBy: this.authService.loggedUser()!.username,
      name: this.formGroup.controls.name.value!,
      producent: this.formGroup.controls.producent.value!,
    }

    this.productService.addProduct(addProductDto)
      .pipe(
        tap(newProduct => this.router.navigate([`/products/${newProduct.id}`])),
        takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }
}

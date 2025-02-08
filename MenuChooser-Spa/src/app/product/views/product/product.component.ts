import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { IProduct, ProductFormType } from '../../models/product.model';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { defaultProduct } from '../../models/default-product.model';

@Component({
  selector: 'mc-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  private productSignal = signal<IProduct>(defaultProduct);
  public product = this.productSignal.asReadonly();

  public formGroup!: FormGroup<ProductFormType>;

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.productSignal.set(data['product'])),
      tap(() => this.initFormGroup()),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private initFormGroup() {
    this.formGroup = this.formBuilder.group<ProductFormType>({
      name: new FormControl(this.product().name),
      producent: new FormControl(this.product().producent),
    })
  }
}

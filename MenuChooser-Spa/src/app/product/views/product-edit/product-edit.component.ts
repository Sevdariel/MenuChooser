import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { defaultProduct } from '../../models/default-product.model';
import { ProductFormType } from '../../models/product.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'mc-product-edit',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);

  public product = input(defaultProduct);

  public formGroup!: FormGroup<ProductFormType>;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(this.product().name),
      producent: new FormControl(this.product().producent),
    })
  }

  public save() {
    
  }
}

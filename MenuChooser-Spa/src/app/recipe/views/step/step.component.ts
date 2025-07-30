import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextarea } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { IStep, IRecipeProduct } from '../../models/recipe.model';
import { IProduct } from '../../../product/models/product.model';

@Component({
  selector: 'mc-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule,
    InputTextarea,
    InputTextModule,
    ButtonModule,
    MultiSelectModule
  ],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class StepComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  private _availableProducts: IRecipeProduct[] = [];
  
  @Input() set availableProducts(products: IRecipeProduct[]) {
    this._availableProducts = products || [];
    this.filterProducts();
  }
  
  get availableProducts(): IRecipeProduct[] {
    return this._availableProducts;
  }
  
  @Input() step: IStep | null = null;
  @Output() save = new EventEmitter<IStep>();
  @Output() cancel = new EventEmitter<void>();

  public stepForm!: FormGroup;
  public selectedProducts = signal<IRecipeProduct[]>([]);

  public ngOnInit(): void {
    this.initializeForm();
    if (this.step) {
      this.patchFormValues();
    }
  }

  public onSubmit(): void {
    if (this.stepForm.valid) {
      const formValue = this.stepForm.getRawValue();
      const step: IStep = {
        order: formValue.order,
        content: formValue.content,
        duration: formValue.duration,
        products: formValue.products
      };
      this.save.emit(step);
    } else {
      this.stepForm.markAllAsTouched();
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  private initializeForm(): void {
    this.stepForm = this.formBuilder.group({
      order: [null, [Validators.required, Validators.min(1)]],
      content: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      products: [[]]
    });
  }

  private patchFormValues(): void {
    if (!this.step) return;

    this.stepForm.patchValue({
      order: this.step.order,
      content: this.step.content,
      duration: this.step.duration,
      products: this.step.products || []
    });
    this.selectedProducts.set(this.step.products || []);
  }

  public onProductSelectionChange(products: IRecipeProduct[]): void {
    // Filter out any products that aren't in the available products list
    const validProducts = products.filter((p: IRecipeProduct) => 
      this.availableProducts.some((ap: IRecipeProduct) => ap.product.id === p.product.id)
    );
    
    this.stepForm.patchValue({
      products: validProducts
    });
  }
  
  private filterProducts(): void {
    if (this.stepForm) {
      const currentProducts = this.stepForm.get('products')?.value || [];
      const filteredProducts = currentProducts.filter((p: IRecipeProduct) => 
        this.availableProducts.some((ap: IRecipeProduct) => ap.product.id === p.product.id)
      );
      
      if (filteredProducts.length !== currentProducts.length) {
        this.stepForm.patchValue({
          products: filteredProducts
        });
      }
    }
  }
}

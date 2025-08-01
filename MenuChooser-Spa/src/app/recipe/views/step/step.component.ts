import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal, computed, effect, input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
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
  public availableProducts = input<IRecipeProduct[]>();

  @Input() set step(step: IStep | null) {
    if (step) {
      this.order.set(step.order);
      this.content.set(step.content);
      this.duration.set(step.duration);
      this.products.set(step.products || []);
    }
  }

  @Output() save = new EventEmitter<IStep>();
  @Output() cancel = new EventEmitter<void>();

  // Form controls using signals with initial values
  public order = signal<number | null>(null);
  public content = signal<string>('');
  public duration = signal<number | null>(null);
  public products = signal<IRecipeProduct[]>([]);

  // Form validation state
  public isFormValid = computed(() =>
    this.order() !== null &&
    this.content().trim().length > 0 &&
    this.duration() !== null
  );

  // Track form dirty state
  public isDirty = signal(false);

  public ngOnInit(): void {
    // Setup effect to track form changes
    effect(() => {
      const currentProducts = this.products();
      const availableProductIds = new Set(this.availableProducts()?.map(p => p.product.id));

      // Filter out any products that aren't in the available products list
      const validProducts = currentProducts.filter(p =>
        p.product && availableProductIds.has(p.product.id)
      );

      if (validProducts.length !== currentProducts.length) {
        this.products.set(validProducts);
      }
    });
  }

  public onSubmit(): void {
    if (this.isFormValid()) {
      const step: IStep = {
        order: this.order()!,
        content: this.content(),
        duration: this.duration()!,
        products: this.products()
      };
      this.save.emit(step);
      this.isDirty.set(false);
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onProductSelectionChange(products: IRecipeProduct[]): void {
    this.products.set(products);
    this.isDirty.set(true);
  }

  // Helper methods to update form values and track dirty state
  public updateOrder(value: number | null): void {
    const numValue = value !== null ? Number(value) : null;
    this.order.set(numValue);
    this.isDirty.set(true);
  }

  public updateContent(value: string): void {
    this.content.set(value || '');
    this.isDirty.set(true);
  }

  public updateDuration(value: number | null): void {
    const numValue = value !== null ? Number(value) : null;
    this.duration.set(numValue);
    this.isDirty.set(true);
  }
}

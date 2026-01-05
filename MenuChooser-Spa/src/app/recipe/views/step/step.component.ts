import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, model, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { IRecipeProduct, IStep, Unit } from '../../models/recipe.model';
import { TableModule } from "primeng/table";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'mc-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    TextareaModule,
    FloatLabelModule,
    TableModule,
    SelectModule
],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class StepComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  public availableProducts = input<IRecipeProduct[]>();
  public step = model<IStep | null>(null);

  protected selectedProducts = signal<IRecipeProduct[] | null>(null);
  protected selectedProductsFormControl = new FormControl<IRecipeProduct[]>([], { nonNullable: true });
  protected unit = Unit;
  protected units = Object.values(Unit);

  public closeDrawer = output();

  public formGroup!: FormGroup;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      order: [this.step()?.order],
      content: [this.step()?.content],
      duration: [this.step()?.duration],
      products: this.formBuilder.array([])
    });

    // this.formGroup.valueChanges.pipe(
    //   debounceTime(500),
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe(formGroup => {
    //   console.log(formGroup);
    //   this.formGroupStepValue.set(formGroup);
    // });

    this.selectedProductsFormControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(products => {
      this.selectedProducts.set(products);
    })
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.step.set(this.formGroup.getRawValue());
      this.closeDrawer.emit();
    }
  }
}

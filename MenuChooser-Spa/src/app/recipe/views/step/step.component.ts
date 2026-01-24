
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { defaultUnit, IRecipeProduct, IStep, Unit } from '../../models/recipe.model';
import { TableModule } from 'primeng/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'mc-step',
  standalone: true,
  imports: [
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
  styleUrl: './step.component.scss',
})
export class StepComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  public availableProducts = input<IRecipeProduct[]>();
  public step = model<IStep | null>(null);

  protected selectedProducts = signal<IRecipeProduct[] | null>(null);
  protected selectedProductsFormControl = new FormControl<IRecipeProduct[]>(
    [],
    { nonNullable: true },
  );
  protected unit = Unit;
  protected units = Object.values(Unit).map((unit) => ({
    label: unit,
    value: unit,
  }));

  public closeDrawer = output<IStep | null>();

  public formGroup!: FormGroup;

  constructor() {
    effect(() => {
      const selected = this.selectedProducts() ?? [];
      const array = this.productsArray;

      // ADD
      selected.forEach((product) => {
        const exists = array.controls.some(
          (ctrl) => ctrl.value.product.id === product.product.id,
        );

        if (!exists) {
          array.push(this.createProductGroup(product));
        }
      });

      array.controls.forEach((ctrl, index) => {
        const stillSelected = selected.some(
          (p) => p.product.id === ctrl.value.product.id,
        );

        if (!stillSelected) {
          array.removeAt(index);
        }
      });
    });

    effect(() => {
      this.formGroup.patchValue({
        order: this.step()?.order,
        content: this.step()?.content,
        duration: this.step()?.duration,
      });

      this.selectedProducts.set(this.step()?.products || null);
    });
  }

  get productsArray(): FormArray<FormGroup> {
    return this.formGroup.get('products') as FormArray<FormGroup>;
  }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      order: [this.step()?.order],
      content: [this.step()?.content],
      duration: [this.step()?.duration],
      products: this.formBuilder.array<FormGroup>([]),
    });

    this.selectedProductsFormControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.selectedProducts.set(products);
      });

    if (!!this.step()) {
      this.selectedProducts.set(this.step()!.products);
    }
  }

  public onSubmit() {
    if (this.formGroup.valid) {
      this.closeDrawer.emit(this.formGroup.getRawValue());
    }
  }

  protected addProductToRecipe() {
    // TODO: Implement add product to recipe logic
    console.log('Add product to recipe');
  }

  private createProductGroup(product: IRecipeProduct): FormGroup {
    const newFormGroup = this.formBuilder.group({
      product: this.formBuilder.control(product.product, { nonNullable: true }),
      quantity: this.formBuilder.control(1, { nonNullable: true }),
      unit: this.formBuilder.control(defaultUnit, Validators.required),
    });

    return newFormGroup;
  }
}

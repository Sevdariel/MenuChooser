import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, ViewChild, DestroyRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, of, tap } from 'rxjs';
import { ProductService } from '../../../product/services/product.service';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IAddRecipeProduct, IRecipe, IRecipeProduct, RecipeFormType, RecipeProductFormType, RecipeStepsFormType } from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { IProduct } from '../../../product/models/product.model';

@Component({
  selector: 'mc-recipe-add',
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    FloatLabel,
    FormsModule,
    MultiSelectModule,
    PopoverModule,
    ReactiveFormsModule,
    TableModule,
    TextareaModule,
    TooltipModule,
    SvgIconComponent,
  ],
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.scss'
})
export class RecipeAddComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeMapperService = inject(RecipeMapperService);
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('addProductPopover') protected addProductPopover!: Popover;
  @ViewChild('addStepPopover') protected addStepPopover!: Popover;

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  public newProduct = signal<IAddRecipeProduct | null>(null);
  public suggestedProducts$: Observable<any> = of();
  public recipeProducts = signal<IRecipeProduct[]>([]);

  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];

  public formGroup!: FormGroup<RecipeFormType>;
  public productsFormControl = new FormControl<IProduct[]>([]);
  public recipeStepFormGroup: FormGroup<RecipeStepsFormType> = new FormGroup({
    content: new FormControl(),
    duration: new FormControl(),
    order: new FormControl(),
    products: new FormControl(),
  });

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      duration: new FormControl(),
      name: new FormControl(''),
      products: this.formBuilder.array(this.recipe().products.map(product => this.formBuilder.group(product))),
      steps: this.recipeMapperService.mapStepsToFormArray(this.recipe().steps),
    });

    this.formGroup.controls.products.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(products => this.recipeProducts.set(products)))
      .subscribe();
  }

  public toggleAddProduct(event: any) {
    this.addProductPopover.toggle(event);
  }

  public toggleAddStep(event: any) {
    console.log('toggleaddstep this.recipeProducts()', this.recipeProducts())
    console.log('toggleaddstep this.formGroup.controls.products.getRawValue()', this.formGroup.controls.products.getRawValue())
    this.addStepPopover.toggle(event);
  }

  public addNewProduct() {
    const recipesProducts = this.productsFormControl.value?.filter(value => Boolean(value))
      .map(value => <FormGroup<RecipeProductFormType>>this.formBuilder.nonNullable.group(<IRecipeProduct>{
        id: value.id,
        name: value.name
      }))!;

    recipesProducts.forEach(recipeProduct => this.formGroup.controls.products.push(recipeProduct));
    this.addProductPopover.hide();
  }

  public addNewStep() {
    // const product = this.productFormControl.value;
    // const recipeProduct = <IRecipeProduct>{
    //   id: product.id,
    //   name: product.name
    // }
    console.log('addNewStep recipeProduct');
    // this.formGroup.controls.products.push(this.formBuilder.group(recipeProduct));
  }

  public filterProducts(event: any) {
    this.suggestedProducts$ = this.productService.getFilteredProducts(event.query);
  }

  public saveRecipe() {

  }
}

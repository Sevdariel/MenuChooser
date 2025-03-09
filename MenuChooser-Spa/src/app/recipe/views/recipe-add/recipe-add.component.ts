import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Popover, PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, of } from 'rxjs';
import { ProductService } from '../../../product/services/product.service';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IAddRecipeProduct, IRecipe, RecipeFormType, RecipeNewProductFormType } from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';

@Component({
  selector: 'mc-recipe-add',
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    FloatLabel,
    FormsModule,
    PopoverModule,
    ReactiveFormsModule,
    TableModule,
    TooltipModule,
    SvgIconComponent,
  ],
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.scss'
})
export class RecipeAddComponent implements OnInit {

  @ViewChild('addProductPopover') addProductPopover!: Popover;

  public newProduct = signal<IAddRecipeProduct | null>(null);
  public suggestedProducts$: Observable<any> = of();

  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeMapperService = inject(RecipeMapperService);
  private readonly productService = inject(ProductService);

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];

  public formGroup!: FormGroup<RecipeFormType>;
  public addProductFormGroup!: FormGroup<RecipeNewProductFormType>;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      duration: new FormControl(),
      name: new FormControl(''),
      products: this.formBuilder.array(this.recipe().products.map(product => this.formBuilder.group(product))),
      steps: this.recipeMapperService.mapStepsToFormArray(this.recipe().steps),
    });

    this.addProductFormGroup = this.formBuilder.group({
      product: new FormControl(),
    });
  }

  public toggleAddProduct(event: any) {
    console.log('toogleAddProduct event', event);

    this.addProductPopover.toggle(event);
  }

  public addNewProduct() {
    console.log('addNewProduct this.addProductFormGroup.getRawValue()', this.addProductFormGroup.getRawValue());
  }

  public filterProducts(event: any) {
    this.suggestedProducts$ = this.productService.getFilteredProducts(event.query);
  }

  public saveRecipe() {

  }
}

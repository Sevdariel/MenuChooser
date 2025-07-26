import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from "primeng/drawer";
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Popover, PopoverModule } from 'primeng/popover';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { flattenObject } from '../../../shared/helpers/flatten-object';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, IRecipeProduct, RecipeFormType, RecipeStepsFormType } from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { RecipeProductComponent } from "../recipe-product/recipe-product.component";

@Component({
  selector: 'mc-recipe-add',
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CommonModule,
    DrawerModule,
    InputTextModule,
    FloatLabel,
    FormsModule,
    MultiSelectModule,
    PopoverModule,
    ReactiveFormsModule,
    RecipeProductComponent,
    SidebarModule,
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

  @ViewChild('addStepPopover') protected addStepPopover!: Popover;

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  public selectedProduct = signal<IRecipeProduct | null>(null);

  public toggleProductPanel = signal<boolean>(false);

  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];

  public formGroup!: FormGroup<RecipeFormType>;
  public recipeStepFormGroup: FormGroup<RecipeStepsFormType> = new FormGroup({
    content: new FormControl(),
    duration: new FormControl(),
    order: new FormControl(),
    products: new FormControl(),
  });

  constructor() {
    effect(() => {
      this.formGroup.patchValue({
        products: this.recipeSignal().products,
      })
    })
  }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      duration: new FormControl(this.recipeSignal().duration),
      name: new FormControl(this.recipeSignal().name),
      products: new FormControl<IRecipeProduct[]>(this.recipeSignal().products),
      steps: this.recipeMapperService.mapStepsToFormArray(this.recipeSignal().steps),
    });
  }

  public displayValue(recipeProduct: IRecipeProduct, field: string) {
    const flat = flattenObject(recipeProduct);
    console.log('flat', flat)
    return flat[field];
  }

  public toggleAddStep(event: any) {
    console.log('toggleaddstep this.formGroup.controls.products.getRawValue()', this.formGroup.controls.products.getRawValue())
    this.addStepPopover.toggle(event);
  }

  public openRecipeProductPreview(recipeProduct: IRecipeProduct | null) {
    this.toggleProductPanel.set(true);
    this.selectedProduct.set(recipeProduct);
  }

  public onRecipeProductSave(recipeProduct: IRecipeProduct) {
    this.recipeSignal.update(recipe => ({
      ...recipe,
      products: [...recipe.products, recipeProduct]
    }))

    this.toggleProductPanel.set(false);
    this.selectedProduct.set(null);
  }

  public addNewStep() {
    console.log('addNewStep recipeProduct', this.formGroup.controls.products.getRawValue());
    // this.formGroup.controls.products.push(this.formBuilder.group(recipeProduct));
  }

  public saveRecipe() {

  }


}

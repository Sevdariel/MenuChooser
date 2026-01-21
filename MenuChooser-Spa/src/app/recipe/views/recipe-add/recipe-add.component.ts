import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { PopoverModule } from 'primeng/popover';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerContent } from '../../../shared/drawer/drawer.model';
import { DrawerService } from '../../../shared/drawer/drawer.service';
import { flattenObject } from '../../../shared/helpers/flatten-object';
import { upsertByPath } from '../../../shared/helpers/upsert-item';
import { defaultRecipe } from '../../models/default-recipe.model';
import {
  IRecipe,
  IRecipeProduct,
  IStep,
  RecipeFormType,
} from '../../models/recipe.model';
import { RecipeProductComponent } from '../recipe-product/recipe-product.component';
import { StepComponent } from '../step/step.component';

@Component({
  selector: 'mc-recipe-add',
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    CommonModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DragDropModule,
    DrawerModule,
    FloatLabel,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    OrderListModule,
    PopoverModule,
    ReactiveFormsModule,
    RecipeProductComponent,
    SelectButtonModule,
    TableModule,
    TagModule,
    TextareaModule,
    ToggleButtonModule,
    TooltipModule,
    StepComponent,
  ],
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.scss',
})
export class RecipeAddComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  public readonly drawerService = inject(DrawerService);

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  public selectedProduct = signal<IRecipeProduct | null>(null);
  public selectedStep = signal<IStep | null>(null);

  public togglePanel = signal<boolean>(false);
  public toggleProductPanel = signal<boolean>(false);
  public toggleStepPanel = signal<boolean>(false);

  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];
  protected readonly stepColumns = [
    { field: 'content', caption: 'Content' },
    { field: 'duration', caption: 'Duration' },
  ];
  protected drawerContent = DrawerContent;

  public formGroup!: FormGroup<RecipeFormType>;

  public draggedStepIndex: number | null = null;

  constructor() {
    effect(() => {
      console.log('this.selectedProduct()', this.selectedProduct());
      console.log('this.selectedStep()', this.selectedStep());
      this.formGroup.patchValue({
        products: [this.selectedProduct()!],
        steps: [this.selectedStep()!],
      });
      console.log(this.formGroup.getRawValue());
    });
  }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      duration: new FormControl(this.recipeSignal().duration),
      name: new FormControl(this.recipeSignal().name),
      products: new FormControl<IRecipeProduct[]>(this.recipeSignal().products),
      steps: new FormControl<IStep[]>(this.recipeSignal().steps),
    });
  }

  public displayValue(recipeProduct: IRecipeProduct, field: string) {
    const flat = flattenObject(recipeProduct);
    return flat[field];
  }

  public openRecipeProductPreview(recipeProduct: IRecipeProduct | null) {
    this.selectedProduct.set(recipeProduct);
    this.drawerService.toggleDrawerPannel(DrawerContent.RecipeProduct);
  }

  public openStepPreview(step: IStep | null) {
    this.selectedStep.set(step);
    this.drawerService.toggleDrawerPannel(DrawerContent.Step);
  }

  public onRecipeProductSave(recipeProduct: IRecipeProduct | null) {
    this.drawerService.toggleDrawerPannel(DrawerContent.None);
    if (!!recipeProduct) {
      this.recipeSignal.update((recipe) => ({
        ...recipe,
        products: upsertByPath(recipe.products, recipeProduct, 'product.id'),
      }));

      this.selectedProduct.set(null);
    }
  }

  public drawerHeader() {
    switch (this.drawerService.contentVisible()) {
      case DrawerContent.RecipeProduct:
        return this.selectedProduct() ? 'Edit Product' : 'Add Product';
      case DrawerContent.Step:
        return this.selectedStep() ? 'Edit Step' : 'Add Step';
      default:
        return '';
    }
  }

  public onStepSave(step: IStep | null) {
    if (!!step) {
      this.recipeSignal.update((recipe) => ({
        ...recipe,
        steps: upsertByPath(recipe.steps, step, 'step.id'),
      }));

      console.log('this.recipeSignal.steps', this.recipeSignal().steps);
      this.selectedStep.set(null);
      this.drawerService.toggleDrawerPannel(DrawerContent.None);
    }
  }

  public onStepCancel() {
    this.selectedStep.set(null);
    this.togglePanel.set(false);
    this.toggleStepPanel.set(false);
  }

  public addNewStep() {
    // const steps = this.formGroup.controls.steps;
    // const newStep: IStep = {
    //   content: this.newStepForm.controls.content.value,
    //   duration: this.newStepForm.controls.duration.value,
    //   order: steps.value.length,
    //   products: this.newStepForm.controls.products.value || []
    // };
    // // steps.push(this.recipeMapperService.mapStepToFormGroup(newStep));
    // this.newStepForm.reset({
    //   content: '',
    //   duration: 0,
    //   order: steps.length,
    //   products: []
    // });
    // this.showAddStepDialog = false;
  }

  public removeStep(index: number) {
    // const steps = this.formGroup.controls.steps;
    // steps.removeAt(index);
    // // Update order of remaining steps
    // steps.controls.forEach((step, idx) => {
    //   step.patchValue({ order: idx });
    // });
  }

  public onStepReorder(event: any) {
    // // Get the reordered array
    // const reorderedItems = event.items;
    // const steps = this.formGroup.controls.steps;
    // // Clear the form array
    // while (steps.length) {
    //   steps.removeAt(0);
    // }
    // // Add the reordered items back with updated order
    // reorderedItems.forEach((item: any, index: number) => {
    //   const step = item.data;
    //   step.patchValue({ order: index });
    //   steps.push(step);
    // });
  }

  public saveRecipe() {}
}

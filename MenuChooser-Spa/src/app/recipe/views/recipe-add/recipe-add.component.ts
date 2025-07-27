import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { DrawerModule } from "primeng/drawer";
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Popover, PopoverModule } from 'primeng/popover';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { flattenObject } from '../../../shared/helpers/flatten-object';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, IRecipeProduct, RecipeFormType, RecipeStepsFormType } from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { RecipeProductComponent } from "../recipe-product/recipe-product.component";
import { StepComponent } from '../../step/step.component';
import { upsertByPath } from '../../../shared/helpers/upsert-item';
import { IStep } from '../../models/recipe.model';

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
    OverlayPanelModule,
    PopoverModule,
    ReactiveFormsModule,
    RecipeProductComponent,
    SelectButtonModule,
    SidebarModule,
    StepComponent,
    TableModule,
    TabViewModule,
    TagModule,
    TextareaModule,
    ToggleButtonModule,
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
  public newStepForm = this.formBuilder.group({
    content: new FormControl('', { nonNullable: true }),
    duration: new FormControl(0, { nonNullable: true }),
    order: new FormControl(0, { nonNullable: true }),
    products: new FormControl<IRecipeProduct[]>([], { nonNullable: true }),
  });
  
  public showAddStepDialog = false;
  public draggedStepIndex: number | null = null;
  
  // Getter for recipe products
  public recipeProducts() {
    return this.recipe().products;
  }

  public onStepDragStart(index: number) {
    this.draggedStepIndex = index;
  }

  public onStepDragEnd() {
    this.draggedStepIndex = null;
  }

  public onStepDrop(event: any, dropIndex: number) {
    if (this.draggedStepIndex !== null) {
      const steps = this.formGroup.controls.steps;
      const movedStep = steps.at(this.draggedStepIndex);
      steps.removeAt(this.draggedStepIndex);
      steps.insert(dropIndex, movedStep);
      
      // Update order of all steps
      steps.controls.forEach((step, idx) => {
        step.patchValue({ order: idx });
      });
      
      this.draggedStepIndex = null;
    }
  }

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
    return flat[field];
  }

  public toggleAddStep(event: any) {
    this.addStepPopover.toggle(event);
  }

  public openRecipeProductPreview(recipeProduct: IRecipeProduct | null) {
    this.selectedProduct.set(recipeProduct);
    this.toggleProductPanel.set(true);
  }

  public onRecipeProductSave(recipeProduct: IRecipeProduct) {
    this.recipeSignal.update(recipe => ({
      ...recipe,
      products: upsertByPath(recipe.products, recipeProduct, 'product.id'),
    }));

    this.selectedProduct.set(null); 
    this.toggleProductPanel.set(false);
  }

  public addNewStep() {
    const steps = this.formGroup.controls.steps;
    const newStep: IStep = {
      content: this.newStepForm.controls.content.value,
      duration: this.newStepForm.controls.duration.value,
      order: steps.length,
      products: this.newStepForm.controls.products.value || []
    };
    
    // steps.push(this.recipeMapperService.mapStepToFormGroup(newStep));
    this.newStepForm.reset({
      content: '',
      duration: 0,
      order: steps.length,
      products: []
    });
    this.showAddStepDialog = false;
  }
  
  public removeStep(index: number) {
    const steps = this.formGroup.controls.steps;
    steps.removeAt(index);
    // Update order of remaining steps
    steps.controls.forEach((step, idx) => {
      step.patchValue({ order: idx });
    });
  }
  
  public onStepReorder(event: any) {
    // Get the reordered array
    const reorderedItems = event.items;
    const steps = this.formGroup.controls.steps;
    
    // Clear the form array
    while (steps.length) {
      steps.removeAt(0);
    }
    
    // Add the reordered items back with updated order
    reorderedItems.forEach((item: any, index: number) => {
      const step = item.data;
      step.patchValue({ order: index });
      steps.push(step);
    });
  }

  public saveRecipe() {

  }

}

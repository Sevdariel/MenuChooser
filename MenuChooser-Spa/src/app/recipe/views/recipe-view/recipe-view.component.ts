import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SvgIconComponent } from 'angular-svg-icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
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
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { filter, take, tap } from 'rxjs';
import { DrawerContent } from '../../../shared/drawer/drawer.model';
import { DrawerService } from '../../../shared/drawer/drawer.service';
import { flattenObject } from '../../../shared/helpers/flatten-object';
import { upsertByPath } from '../../../shared/helpers/upsert-item';
import { defaultRecipe } from '../../models/default-recipe.model';
import {
  IRecipe,
  IRecipeForm,
  IRecipeProduct,
  IStep,
  RecipeFormType,
  MealType,
  Unit,
} from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { RecipeProductComponent } from '../recipe-product/recipe-product.component';
import { StepComponent } from '../step/step.component';
import {
  GetRecipeSuccess,
  SaveRecipe,
  UpdateRecipe,
  UpdateRecipeLocally,
} from '../../store/recipe-form.actions';
import { RecipeFormState } from '../../store/recipe-form.state';

export enum RecipeViewMode {
  PREVIEW = 'preview',
  EDIT = 'edit',
}

@Component({
  selector: 'mc-recipe-view',
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    ChipModule,
    CommonModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DragDropModule,
    DrawerModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    OrderListModule,
    PopoverModule,
    ReactiveFormsModule,
    RecipeProductComponent,
    SelectButtonModule,
    SelectModule,
    TableModule,
    TagModule,
    TextareaModule,
    ToggleButtonModule,
    TooltipModule,
    StepComponent,
  ],
  templateUrl: './recipe-view.component.html',
  styleUrl: './recipe-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeViewComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  public readonly drawerService = inject(DrawerService);
  private readonly recipeMapperService = inject(RecipeMapperService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store);

  @Output() public cancelRequested = new EventEmitter<void>();
  @Output() public saveCompleted = new EventEmitter<void>();

  // Use NGXS state instead of local signal
  public recipe = this.store.selectSignal(RecipeFormState.recipe);
  public isLoading = this.store.selectSignal(RecipeFormState.isLoading);
  public error = this.store.selectSignal(RecipeFormState.error);
  public hasError = this.store.selectSignal(RecipeFormState.hasError);

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

  // View mode control
  public viewMode = signal<RecipeViewMode>(RecipeViewMode.PREVIEW);
  
  // Linked signals to determine mode based on recipe existence
  // New recipes (no ID) start in edit mode
  // Existing recipes start in preview mode
  public isEditMode = linkedSignal(() => {
    const hasId = !!this.recipe()?.id;
    return !hasId || this.viewMode() === RecipeViewMode.EDIT;
  });
  
  public isPreviewMode = linkedSignal(() => !this.isEditMode());

  @HostBinding('class.edit-mode') get editMode() { return this.isEditMode(); }
  @HostBinding('class.preview-mode') get previewMode() { return this.isPreviewMode(); }

  constructor() {
    effect(() => {
      const currentRecipe = this.recipe();
      if (currentRecipe) {
        this.formGroup?.patchValue({
          products: currentRecipe.products,
          steps: currentRecipe.steps,
        });
      }
    });
  }

  public ngOnInit(): void {
    this.loadRecipeFromResolver();
    this.initializeForm();
    this.initializeMode();
  }

  private loadRecipeFromResolver(): void {
    const routeData = this.activatedRoute.snapshot.data['recipe'] as IRecipe;
    if (routeData) {
      this.store.dispatch(new GetRecipeSuccess(routeData));
    }
  }

  private initializeMode(): void {
    // New recipes (no ID) start in edit mode
    // Existing recipes start in preview mode
    const hasId = !!this.recipe()?.id;
    this.viewMode.set(hasId ? RecipeViewMode.PREVIEW : RecipeViewMode.EDIT);
  }

  private initializeForm(): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    this.formGroup = this.formBuilder.group<RecipeFormType>({
      name: new FormControl(currentRecipe.name),
      duration: new FormControl(currentRecipe.duration),
      products: new FormControl<IRecipeProduct[]>(currentRecipe.products),
      steps: new FormControl<IStep[]>(currentRecipe.steps),
      mealType: new FormControl<MealType | null>(currentRecipe.mealType || MealType.Dinner),
      servings: new FormControl<number | null>(currentRecipe.servings || 4),
      caloriesPerServing: new FormControl<number | null>(currentRecipe.caloriesPerServing || 520),
      tags: new FormControl<string[] | null>(currentRecipe.tags || ['🌿 Wegetariańskie', 'Gluten-free', 'Włoska']),
    });
  }

  public switchToEditMode(): void {
    this.viewMode.set(RecipeViewMode.EDIT);
  }

  public switchToPreviewMode(): void {
    this.viewMode.set(RecipeViewMode.PREVIEW);
  }

  public cancelEdit(): void {
    if (this.recipe()?.id) {
      this.switchToPreviewMode();
    } else {
      this.cancelRequested.emit();
    }
  }

  public deleteRecipe(): void {
    // TODO: Implement delete functionality
    console.log('Delete recipe:', this.recipe()?.id);
  }

  public displayValue(recipeProduct: IRecipeProduct, field: string) {
    const flat = flattenObject(recipeProduct);
    return flat[field];
  }

  // Helper methods for new fields
  public getMealTypeName(mealType?: MealType): string {
    switch (mealType) {
      case MealType.Breakfast: return 'Śniadanie';
      case MealType.Dinner: return 'Obiad';
      case MealType.Lunch: return 'Kolacja';
      case MealType.Appetizer: return 'Przystawka';
      case MealType.Dessert: return 'Deser';
      default: return 'Obiad';
    }
  }

  public getUnitName(unit: string): string {
    switch (unit) {
      case 'g': return 'g';
      case 'kg': return 'kg';
      case 'ml': return 'ml';
      case 'l': return 'l';
      case 'szt': return 'szt.';
      default: return unit;
    }
  }

  public getMealTypeOptions() {
    return [
      { label: 'Śniadanie', value: MealType.Breakfast },
      { label: 'Obiad', value: MealType.Dinner },
      { label: 'Kolacja', value: MealType.Lunch },
      { label: 'Przystawka', value: MealType.Appetizer },
      { label: 'Deser', value: MealType.Dessert },
    ];
  }

  public getUnitOptions() {
    return [
      { label: 'g', value: Unit.GRAM },
      { label: 'kg', value: Unit.KILOGRAM },
      { label: 'ml', value: Unit.MILLILITER },
      { label: 'l', value: Unit.LITER },
      { label: 'szt.', value: Unit.PIECE },
    ];
  }

  public addTag() {
    const currentTags = this.formGroup.controls.tags?.value || [];
    const newTag = prompt('Wprowadź nowy tag:');
    if (newTag && newTag.trim()) {
      this.formGroup.controls.tags?.setValue([...currentTags, newTag.trim()]);
    }
  }

  public removeTag(index: number) {
    const currentTags = this.formGroup.controls.tags?.value || [];
    this.formGroup.controls.tags?.setValue(currentTags.filter((_, i) => i !== index));
  }

  public openRecipeProductPreview(recipeProduct: IRecipeProduct | null) {
    this.selectedProduct.set(recipeProduct);
    this.drawerService.toggleDrawerPannel(DrawerContent.RecipeProduct);
  }

  public openStepPreview(step: IStep | null) {
    if (!step) {
      // Nowy krok - znajdź najwyższy numer istniejących kroków
      const currentSteps = this.recipe()?.steps || [];
      const maxOrder = currentSteps.length > 0 
        ? Math.max(...currentSteps.map(s => s.order || 0))
        : 0;
      
      // Ustaw nowy krok z numerem maxOrder + 1 i unikalnym ID
      this.selectedStep.set({
        order: maxOrder + 1,
        content: '',
        duration: 0,
        products: [],
      });
    } else {
      // Edycja istniejącego kroku - zachowaj numer i ID
      this.selectedStep.set(step);
    }
    
    this.drawerService.toggleDrawerPannel(DrawerContent.Step);
  }

  public onRecipeProductSave(recipeProduct: IRecipeProduct | null) {
    this.drawerService.toggleDrawerPannel(DrawerContent.None);
    if (!!recipeProduct) {
      const currentRecipe = this.recipe() || defaultRecipe;
      const updatedRecipe = {
        ...currentRecipe,
        products: upsertByPath(
          currentRecipe.products,
          recipeProduct,
          'product.id',
        ),
      };

      // Update through NGXS state (local update, no HTTP request)
      this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
      this.selectedProduct.set(null);
    }
  }

  public onStepSave(step: IStep | null) {
    if (!!step) {
      const currentRecipe = this.recipe() || defaultRecipe;
      
      const updatedRecipe = {
        ...currentRecipe,
        steps: upsertByPath(currentRecipe.steps, step, 'order'),
      };

      // Update through NGXS state (local update, no HTTP request)
      this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
      this.selectedStep.set(null);
      this.drawerService.toggleDrawerPannel(DrawerContent.None);
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

  public saveRecipe() {
    const formGroupRawValue: IRecipeForm = this.formGroup.getRawValue();

    if (!this.recipe()?.id) {
      // Create new recipe - prepare DTO in component
      const createRecipeDto =
        this.recipeMapperService.mapToCreateRecipeDto(formGroupRawValue);

      const currentRecipeId = this.recipe()?.id;

      this.store.dispatch(new SaveRecipe(createRecipeDto));

      // Listen for recipe creation success
      this.store
        .select(RecipeFormState.recipe)
        .pipe(
          filter((recipe) => recipe?.id !== currentRecipeId && !!recipe?.id),
          take(1),
          tap((recipe) => {
            if (recipe?.id) {
              this.router.navigate([`/recipes/${recipe.id}`]);
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } else if (this.recipe()?.id) {
      // Update existing recipe - prepare DTO in component
      const recipeId = this.recipe()?.id;
      if (!recipeId) return; // Guard against undefined

      const updateRecipeDto = this.recipeMapperService.mapToUpdateRecipeDto(
        formGroupRawValue,
        recipeId,
      );

      // Update recipe via API
      this.store
        .dispatch(new UpdateRecipe(updateRecipeDto))
        .pipe(
          tap(() => {
            // After successful API call, update local state with form data
            const updatedRecipe = {
              ...formGroupRawValue,
              id: recipeId,
            } as IRecipe;
            this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
            // Switch to preview mode after save
            this.switchToPreviewMode();
            // Notify parent that save is completed
            this.saveCompleted.emit();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }
}

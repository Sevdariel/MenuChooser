import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  computed,
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { DrawerModule } from 'primeng/drawer';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { filter, take, tap } from 'rxjs';
import { AuthService } from '../../../core/authorization/auth.service';
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
  MealType,
  RecipeFormType,
  RecipeTag,
  Unit,
} from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import {
  GetRecipeSuccess,
  SaveRecipe,
  UpdateRecipe,
  UpdateRecipeLocally,
} from '../../store/recipe-form.actions';
import { RecipeFormState } from '../../store/recipe-form.state';
import { RecipeProductComponent } from '../recipe-product/recipe-product.component';
import { StepComponent } from '../step/step.component';

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
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store);

  @Output() public cancelRequested = new EventEmitter<void>();
  @Output() public saveCompleted = new EventEmitter<void>();

  @Input() public set recipeInput(recipe: IRecipe | null) {
    if (recipe) {
      this._recipe.set(recipe);
    }
  }

  @Input() public previewOnly = false;

  // Use NGXS state by default, but can be overridden by recipeInput
  private _recipe = signal<IRecipe | null>(null);
  public recipe = computed(() => this._recipe() || this.store.selectSignal(RecipeFormState.recipe)());
  public isLoading = this.store.selectSignal(RecipeFormState.isLoading);
  public error = this.store.selectSignal(RecipeFormState.error);
  public hasError = this.store.selectSignal(RecipeFormState.hasError);

  public selectedProduct = signal<IRecipeProduct | null>(null);
  public selectedStep = signal<IStep | null>(null);
  public expandedStepOrder = signal<number | null>(null);
  public newStepContent = signal<string>('');
  public newStepDuration = signal<number>(0);
  public stepProductSearch = signal<string>('');
  public selectedStepProduct = signal<IRecipeProduct | null>(null);
  public newStepProducts = signal<IRecipeProduct[]>([]);

  public availableProductsForStep = computed(() => {
    const currentRecipe = this.recipe();
    if (!currentRecipe || !currentRecipe.products) return [];

    const search = this.stepProductSearch().toLowerCase();
    return currentRecipe.products.filter(p =>
      p.product.name.toLowerCase().includes(search)
    );
  });

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
        if (!this.formGroup) {
          this.initializeForm();
          // Initialize mode only on first load
          const hasId = !!currentRecipe.id;
          this.viewMode.set(hasId ? RecipeViewMode.PREVIEW : RecipeViewMode.EDIT);
        } else {
          // Only sync products and steps from the store (updated via inline edits).
          // Metadata fields (name, mealType, duration, servings, etc.) are managed
          // directly by form controls and should not be overwritten.
          this.formGroup.patchValue({
            products: currentRecipe.products,
            steps: currentRecipe.steps,
          });
        }
      }
    });
  }

  public ngOnInit(): void {
    this.loadRecipeFromResolver();
    // Initialize form immediately for new recipes (no route data)
    if (!this.formGroup) {
      this.initializeForm();
    }
  }

  private loadRecipeFromResolver(): void {
    const routeData = this.activatedRoute.snapshot.data['recipe'] as IRecipe;
    if (routeData) {
      this.store.dispatch(new GetRecipeSuccess(routeData));
    }
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
      tags: new FormControl<RecipeTag[] | null>(currentRecipe.tags || []),
    });
  }

  public switchToEditMode(): void {
    this.viewMode.set(RecipeViewMode.EDIT);
  }

  public switchToPreviewMode(): void {
    this.viewMode.set(RecipeViewMode.PREVIEW);
  }

  public cancelEdit(): void {
    if (this.isEditMode()) {
      if (this.recipe()?.id) {
        this.switchToPreviewMode();
      } else {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
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
      case Unit.GRAM: case 'g': return 'g';
      case Unit.KILOGRAM: case 'kg': return 'kg';
      case Unit.MILLILITER: case 'ml': return 'ml';
      case Unit.LITER: case 'l': return 'l';
      case Unit.PIECE: case 'szt': return 'szt.';
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

  public getTagOptions(): { label: string; value: RecipeTag }[] {
    return [
      { label: '🌿 Wegetariańskie', value: RecipeTag.Vegetarian },
      { label: '🌱 Wegańskie', value: RecipeTag.Vegan },
      { label: '🌾 Bezglutenowe', value: RecipeTag.GlutenFree },
      { label: '🇮🇹 Włoskie', value: RecipeTag.Italian },
      { label: '🌶 Pikantne', value: RecipeTag.Spicy },
      { label: '⚡ Szybkie', value: RecipeTag.Quick },
      { label: '💪 Zdrowe', value: RecipeTag.Healthy },
    ];
  }

  public getTagName(tag: RecipeTag): string {
    return this.getTagOptions().find((option) => option.value === tag)?.label ?? '';
  }

  public removeTag(tag: RecipeTag) {
    const currentTags = this.formGroup.controls.tags?.value || [];
    this.formGroup.controls.tags?.setValue(currentTags.filter((t) => t !== tag));
  }

  public openRecipeProductPreview(recipeProduct: IRecipeProduct | null) {
    this.selectedProduct.set(recipeProduct);
    this.drawerService.toggleDrawerPannel(DrawerContent.RecipeProduct);
  }

  public addEmptyProduct(): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    const emptyProduct: IRecipeProduct = {
      product: {
        id: `temp-${Date.now()}`,
        name: '',
        producent: '',
        sub: '',
        emoji: '',
        category: 'other' as any,
        unit: 'g',
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        createdBy: '',
        updatedBy: '',
      },
      quantity: 0,
      unit: Unit.GRAM,
    };

    const updatedRecipe = {
      ...currentRecipe,
      products: [...currentRecipe.products, emptyProduct],
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    
    // Update form control directly
    this.formGroup.controls.products?.setValue(updatedRecipe.products);
  }

  public updateProductField(index: number, field: string, event: Event): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    const products = currentRecipe.products.map((p, i) => {
      if (i !== index) return p;
      if (field === 'name') {
        return { ...p, product: { ...p.product, name: (event.target as HTMLInputElement).value } };
      } else if (field === 'quantity') {
        return { ...p, quantity: Number((event.target as HTMLInputElement).value) };
      } else if (field === 'unit') {
        return { ...p, unit: (event.target as HTMLSelectElement).value as Unit };
      }
      return p;
    });

    const updatedRecipe = {
      ...currentRecipe,
      products,
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    this.formGroup.controls.products?.setValue(products);
  }

  public toggleStepExpansion(order: number): void {
    if (this.expandedStepOrder() === order) {
      this.expandedStepOrder.set(null);
    } else {
      this.expandedStepOrder.set(order);
      if (order === -1) {
        // Reset new step form when opening
        this.newStepContent.set('');
        this.newStepDuration.set(0);
      }
    }
  }

  public updateStepField(order: number, field: string, event: Event): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    const steps = [...currentRecipe.steps];

    const stepIndex = steps.findIndex(s => s.order === order);
    if (stepIndex === -1) return;

    if (field === 'content') {
      steps[stepIndex].content = (event.target as HTMLTextAreaElement).value;
    } else if (field === 'duration') {
      steps[stepIndex].duration = Number((event.target as HTMLInputElement).value);
    }

    const updatedRecipe = {
      ...currentRecipe,
      steps,
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    this.formGroup.controls.steps?.setValue(steps);
  }

  public deleteStep(order: number): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    const steps = currentRecipe.steps.filter(s => s.order !== order);

    const updatedRecipe = {
      ...currentRecipe,
      steps,
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    this.formGroup.controls.steps?.setValue(steps);
  }

  public deleteProduct(index: number): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    const products = currentRecipe.products.filter((_, i) => i !== index);

    const updatedRecipe = {
      ...currentRecipe,
      products,
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    this.formGroup.controls.products?.setValue(products);
  }

  public addNewStep(): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    const maxOrder = currentRecipe.steps.length > 0
      ? Math.max(...currentRecipe.steps.map(s => s.order || 0))
      : 0;

    const newStep: IStep = {
      order: maxOrder + 1,
      content: this.newStepContent(),
      duration: this.newStepDuration(),
      products: this.newStepProducts(),
    };

    const updatedRecipe = {
      ...currentRecipe,
      steps: [...currentRecipe.steps, newStep],
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    this.formGroup.controls.steps?.setValue(updatedRecipe.steps);
    this.newStepContent.set('');
    this.newStepDuration.set(0);
    this.newStepProducts.set([]);
    this.expandedStepOrder.set(null);
  }

  public addProductToStep(stepOrder: number): void {
    const selectedProduct = this.selectedStepProduct();
    if (!selectedProduct) return;

    const currentRecipe = this.recipe() || defaultRecipe;
    const steps = [...currentRecipe.steps];
    const stepIndex = steps.findIndex(s => s.order === stepOrder);

    if (stepIndex === -1) return;

    // Check if product already exists in step
    if (steps[stepIndex].products.some(p => p.product.id === selectedProduct.product.id)) {
      return;
    }

    steps[stepIndex].products = [...steps[stepIndex].products, selectedProduct];

    const updatedRecipe = {
      ...currentRecipe,
      steps,
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    this.formGroup.controls.steps?.setValue(steps);
    this.selectedStepProduct.set(null);
    this.stepProductSearch.set('');
  }

  public addProductToNewStep(): void {
    const selectedProduct = this.selectedStepProduct();
    if (!selectedProduct) return;

    // Check if product already exists in new step
    if (this.newStepProducts().some(p => p.product.id === selectedProduct.product.id)) {
      return;
    }

    this.newStepProducts.update(products => [...products, selectedProduct]);
    this.selectedStepProduct.set(null);
  }

  public removeProductFromNewStep(productId: string): void {
    this.newStepProducts.update(products => products.filter(p => p.product.id !== productId));
  }

  public removeProductFromStep(stepOrder: number, productId: string): void {
    const currentRecipe = this.recipe() || defaultRecipe;
    const steps = [...currentRecipe.steps];
    const stepIndex = steps.findIndex(s => s.order === stepOrder);

    if (stepIndex === -1) return;

    steps[stepIndex].products = steps[stepIndex].products.filter(p => p.product.id !== productId);

    const updatedRecipe = {
      ...currentRecipe,
      steps,
    };

    this.store.dispatch(new UpdateRecipeLocally(updatedRecipe));
    this.formGroup.controls.steps?.setValue(steps);
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
            const currentRecipe = this.recipe();
            const updatedRecipe: IRecipe = {
              id: recipeId,
              name: formGroupRawValue.name || '',
              duration: formGroupRawValue.duration || 0,
              products: formGroupRawValue.products || [],
              steps: formGroupRawValue.steps || [],
              mealType: formGroupRawValue.mealType ?? MealType.Dinner,
              servings: formGroupRawValue.servings ?? undefined,
              caloriesPerServing: formGroupRawValue.caloriesPerServing ?? undefined,
              tags: formGroupRawValue.tags ?? [],
              createdBy: currentRecipe?.createdBy || '',
              updatedBy: this.authService.loggedUser()?.username || '',
            };
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

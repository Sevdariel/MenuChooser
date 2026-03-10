import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  linkedSignal,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { tap } from 'rxjs';
import { SvgIconComponent } from 'angular-svg-icon';
import { AuthService } from '../../../core/authorization/auth.service';
import { DrawerContent } from '../../../shared/drawer/drawer.model';
import { DrawerService } from '../../../shared/drawer/drawer.service';
import { flattenObject } from '../../../shared/helpers/flatten-object';
import { upsertByPath } from '../../../shared/helpers/upsert-item';
import { defaultRecipe } from '../../models/default-recipe.model';
import {
  ICreateRecipeDto,
  IUpdateRecipeDto,
} from '../../models/recipe-dto.model';
import {
  IRecipe,
  IRecipeForm,
  IRecipeProduct,
  IStep,
  RecipeFormType,
} from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { RecipeProductComponent } from '../recipe-product/recipe-product.component';
import { StepComponent } from '../step/step.component';
import { RecipeService } from '../../services/recipe.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export enum RecipeMode {
  PREVIEW = 'preview',
  EDIT = 'edit',
}

@Component({
  selector: 'mc-recipe-form',
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
    SvgIconComponent,
    TableModule,
    TagModule,
    TextareaModule,
    ToggleButtonModule,
    TooltipModule,
    StepComponent,
  ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  public readonly drawerService = inject(DrawerService);
  private readonly recipeMapperService = inject(RecipeMapperService);
  private readonly recipeService = inject(RecipeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  public mode = signal<RecipeMode>(RecipeMode.EDIT);

  // Use linkedSignal instead of separate signals + effect
  public isEditMode = linkedSignal(() => this.mode() === RecipeMode.EDIT);
  public isPreviewMode = linkedSignal(() => this.mode() === RecipeMode.PREVIEW);

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
      this.formGroup?.patchValue({
        products: this.recipeSignal().products,
        steps: this.recipeSignal().steps,
      });
    });
  }

  public ngOnInit(): void {
    this.initializeMode();
    this.initializeForm();
  }

  private initializeMode(): void {
    const url = this.router.url;
    if (url.includes('/new')) {
      this.mode.set(RecipeMode.EDIT);
      // For new recipes, keep defaultRecipe (no id)
    } else if (url.includes('/recipes/')) {
      this.mode.set(RecipeMode.PREVIEW);
      this.loadRecipeFromRoute();
    }
  }

  private loadRecipeFromRoute(): void {
    this.activatedRoute.data
      .pipe(
        tap((data) => {
          if (data['recipe']) {
            this.recipeSignal.set(data['recipe']);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private initializeForm(): void {
    const currentRecipe = this.recipeSignal();
    this.formGroup = this.formBuilder.group<RecipeFormType>({
      duration: new FormControl(currentRecipe.duration),
      name: new FormControl(currentRecipe.name),
      products: new FormControl<IRecipeProduct[]>(currentRecipe.products),
      steps: new FormControl<IStep[]>(currentRecipe.steps),
    });
  }

  public switchToEditMode(): void {
    this.mode.set(RecipeMode.EDIT);
  }

  public switchToPreviewMode(): void {
    this.mode.set(RecipeMode.PREVIEW);
  }

  public cancelEdit(): void {
    if (this.isEditMode() && !this.recipe().id) {
      this.router.navigate(['/recipes']);
    } else {
      this.switchToPreviewMode();
      this.initializeForm(); // Reset form to original values
    }
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

      this.selectedStep.set(null);
      this.drawerService.toggleDrawerPannel(DrawerContent.None);
    }
  }

  public saveRecipe() {
    const formGroupRawValue: IRecipeForm = this.formGroup.getRawValue();

    if (this.isEditMode() && !this.recipe().id) {
      const createRecipeDto: ICreateRecipeDto =
        this.recipeMapperService.mapToCreateRecipeDto(formGroupRawValue);

      this.recipeService
        .createRecipe(createRecipeDto)
        .pipe(
          tap((newRecipe) =>
            this.router.navigate([`/recipes/${newRecipe.id}`]),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } else if (this.isEditMode() && this.recipe().id) {
      const updateRecipeDto: IUpdateRecipeDto =
        this.recipeMapperService.mapToUpdateRecipeDto(formGroupRawValue, this.recipe().id);
      // TODO: Implement update functionality
      // const updateRecipeDto: IUpdateRecipeDto = {
      //   ...this.recipe(),
      //   duration: formGroupRawValue.duration!,
      //   name: formGroupRawValue.name!,
      //   productIds: formGroupRawValue.products?.map(product => product.product.id!) || [],
      //   updatedBy: this.authService.loggedUser()?.username!,
      //   steps: formGroupRawValue.steps?.map(({ products, ...step }) => <IStepDto>{
      //     ...step,
      //     productIds: products?.map(product => product.product.id),
      //   }) || [],
      // };

      // this.recipeService.updateRecipe(updateRecipeDto).pipe(
      //   tap(() => {
      //     this.recipeSignal.update(recipe => ({
      //       ...recipe,
      //       ...formGroupRawValue
      //     }));
      //     this.switchToPreviewMode();
      //   }),
      //   takeUntilDestroyed(this.destroyRef))
      //   .subscribe();
    }
  }

  public updateRecipe(updatedRecipe: IRecipe) {
    this.recipeSignal.update(() => updatedRecipe);
    this.togglePanel.set(false);
    this.switchToPreviewMode();
  }
}

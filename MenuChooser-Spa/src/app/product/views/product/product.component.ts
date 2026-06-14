import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/authorization/auth.service';
import { defaultProduct } from '../../models/default-product.model';
import { IAddProductDto, IUpdateProductDto } from '../../models/product-dto.model';
import { IProduct, ProductCategory, ProductFormType } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { RecipeService } from '../../../recipe/services/recipe.service';
import { IRecipeListItem } from '../../../recipe/models/recipe-dto.model';

export enum ProductViewMode {
  PREVIEW = 'preview',
  EDIT = 'edit',
}

@Component({
  selector: 'mc-product',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  public readonly ProductCategory = ProductCategory;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly recipeService = inject(RecipeService);

  protected productSignal = signal<IProduct>(defaultProduct);
  protected product = this.productSignal.asReadonly();
  protected recipesSignal = signal<IRecipeListItem[]>([]);
  protected recipes = this.recipesSignal.asReadonly();

  protected viewMode = signal<ProductViewMode>(ProductViewMode.PREVIEW);

  protected isEditMode = linkedSignal(() => {
    const hasId = !!this.product()?.id;
    return !hasId || this.viewMode() === ProductViewMode.EDIT;
  });

  protected isPreviewMode = linkedSignal(() => !this.isEditMode());

  protected formGroup!: FormGroup<ProductFormType>;

  protected categoryLabels: Record<ProductCategory, { label: string; emoji: string }> = {
    [ProductCategory.VEGETABLES]: { label: 'Warzywa i owoce', emoji: '🥦' },
    [ProductCategory.MEAT]: { label: 'Mięso i ryby', emoji: '🥩' },
    [ProductCategory.DAIRY]: { label: 'Nabiał', emoji: '🥛' },
    [ProductCategory.GRAINS]: { label: 'Produkty zbożowe', emoji: '🌾' },
    [ProductCategory.OTHER]: { label: 'Inne', emoji: '📦' },
  };

  constructor() {
    this.initializeForm(defaultProduct);

    effect(() => {
      const routeData = this.activatedRoute.snapshot.data['product'] as IProduct;
      if (routeData) {
        this.productSignal.set(routeData);
        const hasId = !!routeData.id;
        this.viewMode.set(hasId ? ProductViewMode.PREVIEW : ProductViewMode.EDIT);
        this.patchForm(routeData);

        if (hasId) {
          this.loadRecipes(routeData.id);
        }
      }
    });
  }

  private initializeForm(product: IProduct): void {
    this.formGroup = this.formBuilder.group<ProductFormType>({
      name: new FormControl(product.name),
      producent: new FormControl(product.producent),
      sub: new FormControl(product.sub),
      emoji: new FormControl(product.emoji),
      category: new FormControl(product.category),
      unit: new FormControl(product.unit),
      kcal: new FormControl(product.kcal),
      protein: new FormControl(product.protein),
      carbs: new FormControl(product.carbs),
      fat: new FormControl(product.fat),
    });
  }

  private patchForm(product: IProduct): void {
    this.formGroup.patchValue({
      name: product.name,
      producent: product.producent,
      sub: product.sub,
      emoji: product.emoji,
      category: product.category,
      unit: product.unit,
      kcal: product.kcal,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
    });
  }

  private loadRecipes(productId: string): void {
    this.recipeService.getRecipesByProductId(productId).subscribe({
      next: (recipes) => this.recipesSignal.set(recipes),
      error: (error) => console.error('Failed to load recipes:', error),
    });
  }

  protected switchToEditMode(): void {
    this.viewMode.set(ProductViewMode.EDIT);
  }

  protected switchToPreviewMode(): void {
    this.viewMode.set(ProductViewMode.PREVIEW);
  }

  protected cancelEdit(): void {
    if (this.isEditMode()) {
      if (this.product()?.id) {
        // Revert form to current product data
        this.patchForm(this.product());
        this.switchToPreviewMode();
      } else {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
  }

  protected save(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const formValue = this.formGroup.getRawValue();
    const currentProduct = this.product();

    if (currentProduct.id) {
      // Update existing product
      const updateDto: IUpdateProductDto = {
        id: currentProduct.id,
        createdBy: currentProduct.createdBy,
        updatedBy: this.authService.loggedUser()!.username,
        name: formValue.name ?? '',
        producent: formValue.producent ?? '',
        sub: formValue.sub ?? '',
        emoji: formValue.emoji ?? '',
        category: formValue.category ?? ProductCategory.OTHER,
        unit: formValue.unit ?? '',
        kcal: formValue.kcal ?? 0,
        protein: formValue.protein ?? 0,
        carbs: formValue.carbs ?? 0,
        fat: formValue.fat ?? 0,
      };

      this.productService
        .updateProduct(updateDto)
        .pipe(
          tap(() => {
            this.productSignal.set(updateDto as IProduct);
            this.switchToPreviewMode();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } else {
      // Add new product
      const addDto: IAddProductDto = {
        createdBy: this.authService.loggedUser()!.username,
        name: formValue.name ?? '',
        producent: formValue.producent ?? '',
        sub: formValue.sub ?? '',
        emoji: formValue.emoji ?? '',
        category: formValue.category ?? ProductCategory.OTHER,
        unit: formValue.unit ?? '',
        kcal: formValue.kcal ?? 0,
        protein: formValue.protein ?? 0,
        carbs: formValue.carbs ?? 0,
        fat: formValue.fat ?? 0,
      };

      this.productService
        .addProduct(addDto)
        .pipe(
          tap((newProduct) =>
            this.router.navigate([`/products/${newProduct.id}`]),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  protected deleteProduct(): void {
    // TODO: Implement delete functionality
    console.log('Delete product:', this.product()?.id);
  }

  protected getCategoryName(category?: ProductCategory): string {
    return this.categoryLabels[category || ProductCategory.OTHER]?.label || 'Inne';
  }

  protected getCategoryEmoji(category?: ProductCategory): string {
    return this.categoryLabels[category || ProductCategory.OTHER]?.emoji || '📦';
  }
}

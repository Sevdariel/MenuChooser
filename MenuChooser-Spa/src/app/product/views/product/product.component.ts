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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { tap } from 'rxjs';
import { defaultProduct } from '../../models/default-product.model';
import { IUpdateProductDto } from '../../models/product-dto.model';
import { IProduct } from '../../models/product.model';
import { ProductCategory } from '../../models/product.model';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { RecipeService } from '../../../recipe/services/recipe.service';
import { IRecipeListItem } from '../../../recipe/models/recipe-dto.model';

export enum ProductViewMode {
  PREVIEW = 'preview',
  EDIT = 'edit',
}

@Component({
  selector: 'mc-product',
  imports: [DrawerModule, ProductEditComponent, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  public readonly ProductCategory = ProductCategory;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);

  protected productSignal = signal<IProduct>(defaultProduct);
  protected product = this.productSignal.asReadonly();
  protected togglePanel = signal(false);
  protected recipesSignal = signal<IRecipeListItem[]>([]);
  protected recipes = this.recipesSignal.asReadonly();

  protected viewMode = signal<ProductViewMode>(ProductViewMode.PREVIEW);

  protected isEditMode = linkedSignal(() => {
    const hasId = !!this.product()?.id;
    return !hasId || this.viewMode() === ProductViewMode.EDIT;
  });

  protected isPreviewMode = linkedSignal(() => !this.isEditMode());

  protected categoryLabels: Record<ProductCategory, { label: string; emoji: string }> = {
    [ProductCategory.VEGETABLES]: { label: 'Warzywa i owoce', emoji: '🥦' },
    [ProductCategory.MEAT]: { label: 'Mięso i ryby', emoji: '🥩' },
    [ProductCategory.DAIRY]: { label: 'Nabiał', emoji: '🥛' },
    [ProductCategory.GRAINS]: { label: 'Produkty zbożowe', emoji: '🌾' },
    [ProductCategory.OTHER]: { label: 'Inne', emoji: '📦' },
  };

  constructor() {
    effect(() => {
      const routeData = this.activatedRoute.snapshot.data['product'] as IProduct;
      if (routeData) {
        this.productSignal.set(routeData);
        const hasId = !!routeData.id;
        this.viewMode.set(hasId ? ProductViewMode.PREVIEW : ProductViewMode.EDIT);

        if (hasId) {
          this.loadRecipes(routeData.id);
        }
      }
    });
  }

  private loadRecipes(productId: string): void {
    this.recipeService.getRecipesByProductId(productId).subscribe({
      next: (recipes) => this.recipesSignal.set(recipes),
      error: (error) => console.error('Failed to load recipes:', error)
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
        this.switchToPreviewMode();
      } else {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
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

  protected updateProduct(updatedProduct: IUpdateProductDto) {
    this.productSignal.update(() => updatedProduct);
    this.togglePanel.set(false);
    this.switchToPreviewMode();
  }
}

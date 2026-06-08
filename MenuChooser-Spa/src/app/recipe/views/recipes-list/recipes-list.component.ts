import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { IRecipeListItem } from '../../models/recipe-dto.model';
import { MealType } from '../../models/recipe.model';
import { RecipeState } from './store/recipe.store';
import { RecipeService } from '../../services/recipe.service';
import { GetRecipes } from './store/recipe.actions';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';

@Component({
  selector: 'mc-recipes-list',
  imports: [ConfirmPopup],
  providers: [ConfirmationService],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesListComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly recipeService = inject(RecipeService);
  private readonly confirmationService = inject(ConfirmationService);

  protected recipesList = this.store.selectSignal(RecipeState.getRecipes);

  protected searchQuery = signal('');
  protected activeCategory = signal<MealType | 'all'>('all');
  protected sortBy = signal<'name' | 'time' | 'newest'>('name');
  protected viewMode = signal<'list' | 'grid'>('list');
  protected currentPage = signal(1);
  protected readonly itemsPerPage = 10;

  protected categoryLabels: Record<MealType, { label: string; cls: string; emoji: string }> = {
    [MealType.Breakfast]: { label: 'Śniadanie', cls: 'cat-breakfast', emoji: '🌅' },
    [MealType.Lunch]: { label: 'Obiad', cls: 'cat-lunch', emoji: '☀️' },
    [MealType.Dinner]: { label: 'Kolacja', cls: 'cat-dinner', emoji: '🌙' },
    [MealType.Appetizer]: { label: 'Przekąska', cls: 'cat-snack', emoji: '🍎' },
    [MealType.Dessert]: { label: 'Deser', cls: 'cat-snack', emoji: '�' },
  };

  protected filteredRecipes = computed(() => {
    const recipes = this.recipesList() || [];
    const query = this.searchQuery().toLowerCase();
    const category = this.activeCategory();

    let filtered = recipes.filter((recipe: IRecipeListItem) => {
      const matchCategory = category === 'all' || recipe.mealType === category;
      const matchText = recipe.name.toLowerCase().includes(query);
      return matchCategory && matchText;
    });

    const sort = this.sortBy();
    if (sort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'time') {
      filtered.sort((a, b) => a.duration - b.duration);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    return filtered;
  });

  protected paginatedRecipes = computed(() => {
    const filtered = this.filteredRecipes();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  });

  protected categoryCounts = computed(() => {
    const recipes = this.recipesList() || [];
    return {
      all: recipes.length,
      [MealType.Breakfast]: recipes.filter((r: IRecipeListItem) => r.mealType === MealType.Breakfast).length,
      [MealType.Lunch]: recipes.filter((r: IRecipeListItem) => r.mealType === MealType.Lunch).length,
      [MealType.Dinner]: recipes.filter((r: IRecipeListItem) => r.mealType === MealType.Dinner).length,
    };
  });

  protected paginationInfo = computed(() => {
    const filtered = this.filteredRecipes();
    const start = (this.currentPage() - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, filtered.length);
    return filtered.length > 0
      ? `Wyświetlanie ${start}–${end} z ${filtered.length} przepisów`
      : 'Brak przepisów';
  });

  protected totalPages = computed(() => {
    return Math.ceil(this.filteredRecipes().length / this.itemsPerPage);
  });

  protected totalPagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  protected setCategory(category: MealType | 'all') {
    this.activeCategory.set(category);
    this.currentPage.set(1);
  }

  protected openRecipePreview(recipeId: string) {
    this.router.navigate([`${this.router.url}/${recipeId}`]);
  }

  protected deleteRecipe(event: Event, recipeId: string) {
    this.confirmationService.confirm({
      target: event.target as HTMLElement,
      message: 'Czy na pewno chcesz usunąć ten przepis?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => {
        this.recipeService.deleteRecipe(recipeId).subscribe({
          next: () => {
            this.store.dispatch(new GetRecipes());
          },
          error: (error) => {
            console.error('Error deleting recipe:', error);
          }
        });
      }
    });
  }

  protected addNewRecipe() {
    this.router.navigate([`${this.router.url}/new`]);
  }

  protected nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  protected previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  protected goToPage(page: number) {
    this.currentPage.set(page);
  }

  protected getCategoryLabel(mealType: MealType | null | undefined) {
    if (mealType === null || mealType === undefined) {
      return null;
    }
    return this.categoryLabels[mealType] || null;
  }
}

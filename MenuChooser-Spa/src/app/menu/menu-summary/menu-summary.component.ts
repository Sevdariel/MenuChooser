import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Popover, PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { forkJoin } from 'rxjs';
import { RecipeService } from '../../recipe/services/recipe.service';
import { RecipeViewComponent } from '../../recipe/views/recipe-view/recipe-view.component';
import { MenuGenerateRequest, MenuPreviewDto } from '../models/menu-dto.model';
import { MenuService } from '../services/menu.service';
import { RecipeMapperService } from '../../recipe/services/recipe-mapper.service';
import { IRecipe } from '../../recipe/models/recipe.model';
import { MealType as MenuMealType } from '../models/menu.model';
import { MealType as RecipeMealType, RecipeTag } from '../../recipe/models/recipe.model';
import { UpdateRecipeLocally } from '../../recipe/store/recipe-form.actions';
import { Store } from '@ngxs/store';

interface Meal {
  id: string;
  type: MenuMealType;
  name: string;
  ingredients: string;
  time: number;
  calories: number;
}

interface MenuDay {
  date: string;
  dayName: string;
  dateFormatted: string;
  totalCalories: number;
  meals: Meal[];
}

@Component({
  selector: 'mc-menu-summary',
  imports: [ButtonModule, CardModule, DialogModule, RecipeViewComponent, PopoverModule, FormsModule, SelectModule],
  templateUrl: './menu-summary.component.html',
  styleUrl: './menu-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSummaryComponent {
  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);
  private readonly recipeService = inject(RecipeService);
  private readonly recipeMapperService = inject(RecipeMapperService);
  private readonly store = inject(Store);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public dateFrom = signal<string>('');
  public dateTo = signal<string>('');
  public menuDays = signal<MenuDay[]>([]);

  public isRecipeDialogVisible = signal<boolean>(false);
  public selectedRecipe = signal<IRecipe | null>(null);

  // Recipe swap functionality
  public swapPopover = viewChild<Popover>('swapPopover');
  public swapMealId = signal<string>('');
  public availableRecipes = signal<IRecipe[]>([]);
  public selectedSwapRecipe: IRecipe | null = null;
  public recipeSearchQuery = signal<string>('');
  public selectedMealTypeFilter = signal<RecipeMealType | null>(null);
  public selectedTagFilter = signal<RecipeTag | null>(null);

  constructor() {
    // Retrieve stored data from sessionStorage
    const menuRequest = sessionStorage.getItem('menuRequest');
    const dateFrom = sessionStorage.getItem('dateFrom');
    const dateTo = sessionStorage.getItem('dateTo');

    if (!menuRequest || !dateFrom || !dateTo) {
      // If no data, redirect back to generate page
      this.router.navigate(['/menu/generate']);
      return;
    }

    this.dateFrom.set(dateFrom);
    this.dateTo.set(dateTo);

    // Fetch menu preview from backend (same data that will be in PDF)
    this.loadMenuPreviewFromBackend(menuRequest);
  }

  private loadMenuPreviewFromBackend(menuRequest: string): void {
    const request: MenuGenerateRequest = JSON.parse(menuRequest);
    this.isLoading.set(true);

    this.menuService.previewMenu(request).subscribe({
      next: (preview) => {
        // Store preview so PDF can use the exact same menu
        sessionStorage.setItem('menuPreview', JSON.stringify(preview));
        this.menuDays.set(this.mapPreviewToMenuDays(preview));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Nie udało się załadować podglądu menu. Spróbuj ponownie.');
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 3000);
      },
    });
  }

  private mapPreviewToMenuDays(preview: MenuPreviewDto): MenuDay[] {
    const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
    const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

    return preview.days.map((day, index) => {
      const date = new Date(day.date);
      const dayIndex = date.getDay();
      const dayName = dayNames[dayIndex];
      const dateFormatted = `${date.getDate()} ${months[date.getMonth()]}`;

      const meals: Meal[] = day.meals.map(meal => ({
        id: `${meal.recipe.id}-${day.date}-${meal.type}`,
        type: meal.type,
        name: meal.recipe.name,
        ingredients: 'Składniki z przepisu',
        time: meal.recipe.duration,
        calories: meal.type === MenuMealType.Breakfast ? 340 : meal.type === MenuMealType.Lunch ? 520 : 280,
      }));

      return {
        date: day.date,
        dayName,
        dateFormatted,
        totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
        meals,
      };
    });
  }


  public dateRange(): string {
    return `${this.dateFromFormatted()} – ${this.dateToFormatted()}`;
  }

  public dateFromFormatted(): string {
    return this.formatDate(this.dateFrom());
  }

  public dateToFormatted(): string {
    return this.formatDate(this.dateTo());
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  public daysCount(): number {
    return this.menuDays().length;
  }

  public totalRecipes(): number {
    return this.menuDays().reduce((sum, day) => sum + day.meals.length, 0);
  }

  public avgTime(): number {
    const total = this.menuDays().reduce((sum, day) => sum + day.meals.reduce((daySum, meal) => daySum + meal.time, 0), 0);
    return Math.round(total / this.daysCount());
  }

  public avgCalories(): number {
    const total = this.menuDays().reduce((sum, day) => sum + day.totalCalories, 0);
    return Math.round(total / this.daysCount());
  }

  public uniqueRecipes(): number {
    const uniqueNames = new Set(this.menuDays().flatMap(day => day.meals.map(meal => meal.name)));
    return uniqueNames.size;
  }

  public getMealTypeBadgeClass(type: MenuMealType): string {
    switch (type) {
      case MenuMealType.Breakfast: return 'badge-breakfast';
      case MenuMealType.Lunch: return 'badge-lunch';
      case MenuMealType.Dinner: return 'badge-dinner';
      default: return '';
    }
  }

  public getMealTypeIcon(type: MenuMealType): string {
    switch (type) {
      case MenuMealType.Breakfast: return '🌅';
      case MenuMealType.Lunch: return '☀️';
      case MenuMealType.Dinner: return '🌙';
      default: return '';
    }
  }

  public getMealTypeName(type: MenuMealType): string {
    switch (type) {
      case MenuMealType.Breakfast: return 'Śniadanie';
      case MenuMealType.Lunch: return 'Obiad';
      case MenuMealType.Dinner: return 'Kolacja';
      default: return '';
    }
  }

  public viewRecipe(mealId: string): void {
    // Extract the actual recipe ID from the composite meal ID
    // The meal ID format is: {recipeId}-{date}-{mealType}
    const recipeId = mealId.split('-')[0];
    if (!recipeId) {
      this.errorMessage.set('Brak ID przepisu.');
      setTimeout(() => this.errorMessage.set(''), 3000);
      return;
    }

    this.isLoading.set(true);
    // Fetch recipe directly and dispatch to NGXS state
    this.recipeService.getRecipe(recipeId).subscribe({
      next: (recipeDto) => {
        const recipe = this.recipeMapperService.mapToModel(recipeDto);
        this.selectedRecipe.set(recipe);
        // Dispatch to NGXS state for RecipeViewComponent
        this.store.dispatch(new UpdateRecipeLocally(recipe));
        this.isRecipeDialogVisible.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Nie udało się załadować przepisu. Przepis może nie istnieć w bazie danych.');
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 3000);
      },
    });
  }

  public closeRecipeDialog(): void {
    this.isRecipeDialogVisible.set(false);
    this.selectedRecipe.set(null);
  }

  public swapRecipe(event: MouseEvent, mealId: string): void {
    this.swapMealId.set(mealId);
    this.selectedSwapRecipe = null;
    this.recipeSearchQuery.set('');
    this.selectedMealTypeFilter.set(null);
    this.selectedTagFilter.set(null);

    // Toggle popover
    this.swapPopover()?.toggle(event);

    // Load available recipes for swapping with full details
    this.recipeService.getRecipes().subscribe({
      next: (recipeListItems) => {
        const recipeDetails$ = recipeListItems.map(item =>
          this.recipeService.getRecipe(item.id)
        );
        forkJoin(recipeDetails$).subscribe({
          next: (recipeDtos) => {
            const recipes = recipeDtos.map(dto => this.recipeMapperService.mapToModel(dto));
            this.availableRecipes.set(recipes);
          },
          error: (err) => {
            console.error('Error loading recipe details for swap:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error loading recipes for swap:', err);
      },
    });
  }

  public searchRecipes(event: any): void {
    const query = event.query.toLowerCase();
    this.recipeSearchQuery.set(query);
  }

  public filteredRecipes = computed(() => {
    const query = this.recipeSearchQuery().toLowerCase();
    const mealTypeFilter = this.selectedMealTypeFilter();
    const tagFilter = this.selectedTagFilter();
    const recipes = this.availableRecipes();

    return recipes.filter(recipe => {
      // Name search filter
      const matchesName = !query || recipe.name.toLowerCase().includes(query);
      // Meal type filter
      const matchesMealType = !mealTypeFilter || recipe.mealType === mealTypeFilter;
      // Tag filter
      const matchesTag = !tagFilter || (recipe.tags && recipe.tags.includes(tagFilter));
      return matchesName && matchesMealType && matchesTag;
    });
  });

  public mealTypeOptions = [
    { label: 'Śniadanie', value: RecipeMealType.Breakfast },
    { label: 'Obiad', value: RecipeMealType.Lunch },
    { label: 'Kolacja', value: RecipeMealType.Dinner },
    { label: 'Przekąska', value: RecipeMealType.Appetizer },
    { label: 'Deser', value: RecipeMealType.Dessert },
  ];

  public tagOptions = [
    { label: 'Wegetariańskie', value: RecipeTag.Vegetarian },
    { label: 'Wegańskie', value: RecipeTag.Vegan },
    { label: 'Bez glutenu', value: RecipeTag.GlutenFree },
    { label: 'Włoskie', value: RecipeTag.Italian },
    { label: 'Pikantne', value: RecipeTag.Spicy },
    { label: 'Szybkie', value: RecipeTag.Quick },
    { label: 'Zdrowe', value: RecipeTag.Healthy },
  ];

  public selectSwapRecipe(recipe: IRecipe): void {
    const mealId = this.swapMealId();
    if (recipe && mealId) {
      const currentMenuDays = this.menuDays();
      const updatedMenuDays = currentMenuDays.map(day => ({
        ...day,
        meals: day.meals.map(meal =>
          meal.id === mealId
            ? { ...meal, id: recipe.id, name: recipe.name, ingredients: 'Składniki z przepisu', time: recipe.duration, calories: 0 }
            : meal
        ),
      }));
      this.menuDays.set(updatedMenuDays);
      this.swapPopover()?.hide();
      this.recipeSearchQuery.set('');
    }
  }

  public fileName(): string {
    return `menu-${this.dateFrom()}-${this.dateTo()}.pdf`;
  }

  public goBack(): void {
    this.router.navigate(['/menu/generate']);
  }

  public downloadPdf(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    // Retrieve the stored preview menu (same data shown in summary)
    const menuPreviewStr = sessionStorage.getItem('menuPreview');
    const dateFrom = sessionStorage.getItem('dateFrom');
    const dateTo = sessionStorage.getItem('dateTo');

    if (!menuPreviewStr || !dateFrom || !dateTo) {
      this.errorMessage.set('Brak danych do wygenerowania PDF. Wróć i wygeneruj jadłospis ponownie.');
      this.isLoading.set(false);
      return;
    }

    const preview: MenuPreviewDto = JSON.parse(menuPreviewStr);

    // Generate PDF from the exact same menu preview shown in summary
    this.menuService.generateMenuFromPreview(preview).subscribe({
      next: (response: Blob) => {
        const url = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fileName();
        a.click();
        URL.revokeObjectURL(url);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Nie udało się pobrać PDF. Spróbuj ponownie.');
        this.isLoading.set(false);
      },
    });
  }
}

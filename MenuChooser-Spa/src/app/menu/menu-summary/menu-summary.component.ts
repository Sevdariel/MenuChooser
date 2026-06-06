import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenuService } from '../services/menu.service';
import { MenuGenerateRequest } from '../models/menu-dto.model';
import { RecipeService } from '../../recipe/services/recipe.service';
import { IRecipe } from '../../recipe/models/recipe.model';
import { Store } from '@ngxs/store';
import { GetRecipe } from '../../recipe/store/recipe-form.actions';
import { RecipeViewComponent } from '../../recipe/views/recipe-view/recipe-view.component';
import { RecipeFormState } from '../../recipe/store/recipe-form.state';

interface Meal {
  id: string;
  type: MealType;
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

enum MealType {
  Breakfast = 0,
  Lunch = 1,
  Dinner = 2,
}

@Component({
  selector: 'mc-menu-summary',
  imports: [ButtonModule, CardModule, DialogModule, RecipeViewComponent],
  templateUrl: './menu-summary.component.html',
  styleUrl: './menu-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSummaryComponent {
  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);
  private readonly recipeService = inject(RecipeService);
  private readonly store = inject(Store);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public dateFrom = signal<string>('');
  public dateTo = signal<string>('');
  public menuDays = signal<MenuDay[]>([]);

  public isRecipeDialogVisible = signal<boolean>(false);
  public recipeLoaded = this.store.selectSignal(RecipeFormState.recipe);

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

    // Fetch real recipes from API for mock data
    this.loadRecipesAndGenerateMockData(dateFrom, dateTo);
  }

  private loadRecipesAndGenerateMockData(dateFrom: string, dateTo: string): void {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.generateMockMenuData(dateFrom, dateTo, recipes);
      },
      error: () => {
        // Fallback to empty mock data if API fails
        this.generateMockMenuData(dateFrom, dateTo, []);
      },
    });
  }

  private generateMockMenuData(dateFrom: string, dateTo: string, availableRecipes: any[] = []): void {
    const days: MenuDay[] = [];
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
    const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

    // Use real recipes if available, otherwise use mock data
    let mockMeals: Meal[] = [];

    if (availableRecipes.length >= 3) {
      // Use real recipes from API
      mockMeals = [
        { id: availableRecipes[0].id, type: MealType.Breakfast, name: availableRecipes[0].name, ingredients: 'Składniki z przepisu', time: availableRecipes[0].duration, calories: 340 },
        { id: availableRecipes[1].id, type: MealType.Lunch, name: availableRecipes[1].name, ingredients: 'Składniki z przepisu', time: availableRecipes[1].duration, calories: 520 },
        { id: availableRecipes[2].id, type: MealType.Dinner, name: availableRecipes[2].name, ingredients: 'Składniki z przepisu', time: availableRecipes[2].duration, calories: 280 },
      ];
    } else {
      // Fallback to mock data with valid MongoDB ObjectId-like strings
      mockMeals = [
        { id: '507f1f77bcf86cd799439011', type: MealType.Breakfast, name: 'Owsianka z owocami', ingredients: 'Płatki owsiane, mleko, banan', time: 10, calories: 340 },
        { id: '507f1f77bcf86cd799439012', type: MealType.Lunch, name: 'Spaghetti Bolognese', ingredients: 'Makaron, wołowina, pomidory', time: 45, calories: 520 },
        { id: '507f1f77bcf86cd799439013', type: MealType.Dinner, name: 'Sałatka grecka z fetą', ingredients: 'Pomidory, ogórek, feta, oliwki', time: 15, calories: 280 },
      ];
    }

    let currentDate = new Date(startDate);
    let dayIndex = startDate.getDay();

    while (currentDate <= endDate) {
      const dayName = dayNames[dayIndex];
      const dateFormatted = `${currentDate.getDate()} ${months[currentDate.getMonth()]}`;

      const day: MenuDay = {
        date: currentDate.toISOString().split('T')[0],
        dayName,
        dateFormatted,
        totalCalories: mockMeals.reduce((sum, meal) => sum + meal.calories, 0),
        meals: mockMeals.map(meal => ({ ...meal, id: meal.id })),
      };

      days.push(day);
      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex = (dayIndex + 1) % 7;
    }

    this.menuDays.set(days);
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

  public getMealTypeBadgeClass(type: MealType): string {
    switch (type) {
      case MealType.Breakfast: return 'badge-breakfast';
      case MealType.Lunch: return 'badge-lunch';
      case MealType.Dinner: return 'badge-dinner';
      default: return '';
    }
  }

  public getMealTypeIcon(type: MealType): string {
    switch (type) {
      case MealType.Breakfast: return '🌅';
      case MealType.Lunch: return '☀️';
      case MealType.Dinner: return '🌙';
      default: return '';
    }
  }

  public getMealTypeName(type: MealType): string {
    switch (type) {
      case MealType.Breakfast: return 'Śniadanie';
      case MealType.Lunch: return 'Obiad';
      case MealType.Dinner: return 'Kolacja';
      default: return '';
    }
  }

  public viewRecipe(mealId: string): void {
    console.log('viewRecipe called with mealId:', mealId);
    // Use the meal ID directly as recipe ID (now using valid MongoDB ObjectId format)
    const recipeId = mealId;
    if (!recipeId) {
      console.log('No recipeId provided');
      this.errorMessage.set('Brak ID przepisu.');
      setTimeout(() => this.errorMessage.set(''), 3000);
      return;
    }

    this.isLoading.set(true);
    console.log('Dispatching GetRecipe with ID:', recipeId);
    // Dispatch GetRecipe action to properly load recipe through NGXS state
    this.store.dispatch(new GetRecipe(recipeId)).subscribe({
      next: () => {
        console.log('GetRecipe action completed');
        // Wait a tick to ensure state is updated before opening dialog
        setTimeout(() => {
          this.isRecipeDialogVisible.set(true);
          this.isLoading.set(false);
        });
      },
      error: (err) => {
        console.error('GetRecipe error:', err);
        this.errorMessage.set('Nie udało się załadować przepisu. Przepis może nie istnieć w bazie danych.');
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 3000);
      },
    });
  }

  public closeRecipeDialog(): void {
    this.isRecipeDialogVisible.set(false);
  }

  public swapRecipe(mealId: string): void {
    // TODO: Open recipe picker
    console.log('Swap recipe:', mealId);
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

    // Retrieve the stored request data
    const menuRequestStr = sessionStorage.getItem('menuRequest');
    const dateFrom = sessionStorage.getItem('dateFrom');
    const dateTo = sessionStorage.getItem('dateTo');

    if (!menuRequestStr || !dateFrom || !dateTo) {
      this.errorMessage.set('Brak danych do wygenerowania PDF. Wróć i wygeneruj jadłospis ponownie.');
      this.isLoading.set(false);
      return;
    }

    const request: MenuGenerateRequest = JSON.parse(menuRequestStr);

    this.menuService.generateMenu(request).subscribe({
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

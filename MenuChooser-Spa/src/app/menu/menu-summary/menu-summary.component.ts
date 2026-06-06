import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuService } from '../services/menu.service';
import { MenuGenerateRequest } from '../models/menu-dto.model';

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
  imports: [ButtonModule, CardModule],
  templateUrl: './menu-summary.component.html',
  styleUrl: './menu-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSummaryComponent {
  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public dateFrom = signal<string>('');
  public dateTo = signal<string>('');
  public menuDays = signal<MenuDay[]>([]);

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

    // Generate mock data for now - in real implementation, this would come from the API
    this.generateMockMenuData(dateFrom, dateTo);
  }

  private generateMockMenuData(dateFrom: string, dateTo: string): void {
    const days: MenuDay[] = [];
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const dayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
    const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

    const mockMeals: Meal[] = [
      { id: '1', type: MealType.Breakfast, name: 'Owsianka z owocami', ingredients: 'Płatki owsiane, mleko, banan', time: 10, calories: 340 },
      { id: '2', type: MealType.Lunch, name: 'Spaghetti Bolognese', ingredients: 'Makaron, wołowina, pomidory', time: 45, calories: 520 },
      { id: '3', type: MealType.Dinner, name: 'Sałatka grecka z fetą', ingredients: 'Pomidory, ogórek, feta, oliwki', time: 15, calories: 280 },
    ];

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
        meals: mockMeals.map(meal => ({ ...meal, id: `${dayName}-${meal.id}` })),
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
    // TODO: Navigate to recipe view
    console.log('View recipe:', mealId);
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

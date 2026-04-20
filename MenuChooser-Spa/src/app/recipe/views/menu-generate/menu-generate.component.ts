import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToggleButtonModule } from 'primeng/togglebutton';

export enum MealType {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Snack = 'snack',
  Dinner = 'dinner',
}

export interface MealToggle {
  type: MealType;
  name: string;
  time: string;
  icon: string;
  iconBackground: string;
  enabled: boolean;
}

@Component({
  selector: 'mc-menu-generate',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ToggleButtonModule,
  ],
  templateUrl: './menu-generate.component.html',
  styleUrl: './menu-generate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuGenerateComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public formGroup!: FormGroup<{
    dateFrom: FormControl<string | null>;
    dateTo: FormControl<string | null>;
  }>;

  public mealToggles = signal<MealToggle[]>([
    {
      type: MealType.Breakfast,
      name: 'Śniadanie',
      time: '7:00 – 9:00',
      icon: '🌅',
      iconBackground: 'rgba(212,132,90,0.1)',
      enabled: true,
    },
    {
      type: MealType.Lunch,
      name: 'Obiad',
      time: '12:00 – 14:00',
      icon: '☀️',
      iconBackground: 'rgba(106,145,99,0.1)',
      enabled: true,
    },
    {
      type: MealType.Snack,
      name: 'Podwieczorek',
      time: '15:00 – 17:00',
      icon: '🍎',
      iconBackground: 'rgba(160,112,96,0.08)',
      enabled: false,
    },
    {
      type: MealType.Dinner,
      name: 'Kolacja',
      time: '18:00 – 20:00',
      icon: '🌙',
      iconBackground: 'rgba(92,61,46,0.08)',
      enabled: true,
    },
  ]);

  public daysCount = signal<number>(7);
  public mealsPerDay = signal<number>(3);
  public totalRecipes = signal<number>(21);

  constructor() {
    this.initializeForm();
    this.updateSummary();
  }

  private initializeForm(): void {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 6);

    this.formGroup = this.formBuilder.group({
      dateFrom: new FormControl<string | null>(
        this.formatDate(today),
        Validators.required,
      ),
      dateTo: new FormControl<string | null>(
        this.formatDate(nextWeek),
        Validators.required,
      ),
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.updateSummary();
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public toggleMeal(type: MealType): void {
    const currentToggles = this.mealToggles();
    const updatedToggles = currentToggles.map((toggle) =>
      toggle.type === type ? { ...toggle, enabled: !toggle.enabled } : toggle,
    );
    this.mealToggles.set(updatedToggles);
    this.updateSummary();
  }

  private updateSummary(): void {
    const dateFrom = this.formGroup.value.dateFrom;
    const dateTo = this.formGroup.value.dateTo;

    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
      this.daysCount.set(days);
    }

    const enabledMeals = this.mealToggles().filter((m) => m.enabled).length;
    this.mealsPerDay.set(enabledMeals);

    this.totalRecipes.set(this.daysCount() * this.mealsPerDay());
  }

  public getDaysLabel(): string {
    const days = this.daysCount();
    if (days === 1) return 'dzień';
    if (days < 5) return 'dni';
    return 'dni';
  }

  public goBack(): void {
    this.router.navigate(['/recipes']);
  }

  public async generateMenu(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const dateFrom = this.formGroup.value.dateFrom;
    const dateTo = this.formGroup.value.dateTo;
    const enabledMealTypes = this.mealToggles()
      .filter((m) => m.enabled)
      .map((m) => m.type);

    try {
      // TODO: Implement actual API call
      // const response = await this.http.post('/api/menu/generate', {
      //   dateFrom,
      //   dateTo,
      //   mealTypes: enabledMealTypes,
      // }).toPromise();

      // Simulation for mockup
      await new Promise((resolve) => setTimeout(resolve, 2200));

      alert(
        `✅ PDF pobrany!\n\nZakres: ${dateFrom} → ${dateTo}\nPosiłki: ${enabledMealTypes.join(', ')}`,
      );

      // TODO: Handle PDF download
      // const blob = response as Blob;
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `menu-${dateFrom}-${dateTo}.pdf`;
      // a.click();
      // URL.revokeObjectURL(url);
    } catch (error) {
      this.errorMessage.set('Nie udało się wygenerować menu. Spróbuj ponownie.');
    } finally {
      this.isLoading.set(false);
    }
  }
}

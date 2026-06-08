import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MenuDefault } from '../models/menu-default';
import { Menu } from '../models/menu.model';
import { MenuService } from '../services/menu.service';
import { MenuGenerateMapper } from '../mappers/menu-generate-mapper';



@Component({
  selector: 'mc-menu-generate',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ToggleSwitchModule,
  ],
  templateUrl: './menu-generate.component.html',
  styleUrl: './menu-generate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuGenerateComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly menuService = inject(MenuService);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public formGroup!: FormGroup<{
    dateFrom: FormControl<string | null>;
    dateTo: FormControl<string | null>;
  }>;

  public menu = signal<Menu[]>(MenuDefault);

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

  private updateSummary(): void {
    const dateFrom = this.formGroup.value.dateFrom;
    const dateTo = this.formGroup.value.dateTo;

    if (dateFrom && dateTo) {
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
      this.daysCount.set(days);
    }

    const enabledMeals = this.menu().filter((m) => m.enabled).length;
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

  public generateMenu(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const dateFrom = this.formGroup.value.dateFrom;
    const dateTo = this.formGroup.value.dateTo;

    const request = MenuGenerateMapper.toDto(this.menu(), dateFrom!, dateTo!);

    // Store the request for later use in summary view
    sessionStorage.setItem('menuRequest', JSON.stringify(request));
    sessionStorage.setItem('dateFrom', dateFrom!);
    sessionStorage.setItem('dateTo', dateTo!);

    // Navigate to summary view instead of downloading PDF directly
    this.isLoading.set(false);
    this.router.navigate(['/menu/summary']);
  }
}

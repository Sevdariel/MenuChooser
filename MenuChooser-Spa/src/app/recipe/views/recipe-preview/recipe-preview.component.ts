import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IRecipe, MealType } from '../../models/recipe.model';
import { flattenObject } from '../../../shared/helpers/flatten-object';

@Component({
  selector: 'mc-recipe-preview',
  standalone: true,
  host: {
    class: 'preview-mode'
  },
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChipModule,
    DataViewModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './recipe-preview.component.html',
  styleUrl: './recipe-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipePreviewComponent {
  public recipe = input.required<IRecipe>();
  public editRequested = output<void>();

  public productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];

  public displayValue(item: any, field: string) {
    const flat = flattenObject(item);
    return flat[field];
  }

  public switchToEditMode() {
    this.editRequested.emit();
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
      case 'g': return 'g';
      case 'kg': return 'kg';
      case 'ml': return 'ml';
      case 'l': return 'l';
      case 'szt': return 'szt.';
      default: return unit;
    }
  }
}

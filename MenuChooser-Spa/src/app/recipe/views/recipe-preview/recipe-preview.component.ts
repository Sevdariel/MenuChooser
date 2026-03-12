import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IRecipe } from '../../models/recipe.model';
import { flattenObject } from '../../../shared/helpers/flatten-object';

@Component({
  selector: 'mc-recipe-preview',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
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
}

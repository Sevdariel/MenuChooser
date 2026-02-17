import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { RecipeState } from '../../store/recipe.store';

@Component({
  selector: 'mc-recipes-list',
  imports: [SvgIconComponent, ButtonModule, TableModule, DrawerModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss',
})
export class RecipesListComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  protected recipesList = this.store.selectSignal(RecipeState.getRecipes);

  public readonly columns = [
    { field: 'name', header: 'Name' },
    { field: 'duration', header: 'Duration' },
    { field: 'mealType', header: 'Meal type' },
  ];

  public openRecipePreview(recipeId: string) {
    this.router.navigate([`${this.router.url}/${recipeId}`]);
  }

  public addNewRecipe() {
    this.router.navigate([`${this.router.url}/new`]);
  }
}

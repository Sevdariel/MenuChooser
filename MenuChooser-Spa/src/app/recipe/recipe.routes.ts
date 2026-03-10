import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { recipeResolver } from './resolvers/recipe.resolver';
import { recipesResolver } from './resolvers/recipes.resolver';
import { RecipeState } from './store/recipe.store';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/recipes-list/recipes-list.component').then(
        (m) => m.RecipesListComponent,
      ),
    providers: [importProvidersFrom(NgxsModule.forFeature([RecipeState]))],
    resolve: { recipes: recipesResolver },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./views/recipe-form/recipe-form.component').then(
        (m) => m.RecipeFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./views/recipe-form/recipe-form.component').then(
        (m) => m.RecipeFormComponent,
      ),
    resolve: { recipe: recipeResolver },
  },
];

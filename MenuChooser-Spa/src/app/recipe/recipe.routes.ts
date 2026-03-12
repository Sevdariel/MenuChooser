import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { recipeResolver } from './resolvers/recipe.resolver';
import { recipesResolver } from './resolvers/recipes.resolver';
import { RecipeFormState } from './views/recipe-form/store/recipe-form.state';
import { RecipeState } from './views/recipes-list/store/recipe.store';

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
    providers: [importProvidersFrom(NgxsModule.forFeature([RecipeFormState]))],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./views/recipe-shell/recipe-shell.component').then(
        (m) => m.RecipeShellComponent,
      ),
    resolve: { recipe: recipeResolver },
    providers: [importProvidersFrom(NgxsModule.forFeature([RecipeFormState]))],
  },
];

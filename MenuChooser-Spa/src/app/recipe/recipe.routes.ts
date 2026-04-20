import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { recipeResolver } from './resolvers/recipe.resolver';
import { recipesResolver } from './resolvers/recipes.resolver';
import { RecipeFormState } from './store/recipe-form.state';
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
      import('./views/recipe-view/recipe-view.component').then(
        (m) => m.RecipeViewComponent,
      ),
    providers: [importProvidersFrom(NgxsModule.forFeature([RecipeFormState]))],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./views/recipe-view/recipe-view.component').then(
        (m) => m.RecipeViewComponent,
      ),
    resolve: { recipe: recipeResolver },
    providers: [importProvidersFrom(NgxsModule.forFeature([RecipeFormState]))],
  },
];

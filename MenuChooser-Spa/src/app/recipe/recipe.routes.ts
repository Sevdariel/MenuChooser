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
      import('./views/recipe-add/recipe-add.component').then(
        (m) => m.RecipeAddComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./views/recipe-preview/recipe-preview.component').then(
        (m) => m.RecipePreviewComponent,
      ),
    resolve: { recipe: recipeResolver },
  },
];

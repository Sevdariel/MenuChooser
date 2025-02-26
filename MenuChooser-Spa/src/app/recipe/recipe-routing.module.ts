import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { recipeResolver } from './resolvers/recipe.resolver';
import { recipesResolver } from './resolvers/recipes.resolver';
import { RecipePreviewComponent } from './views/recipe-preview/recipe-preview.component';
import { RecipesListComponent } from './views/recipes-list/recipes-list.component';

const routes: Routes = [
  {
    path: '',
    component: RecipesListComponent,
    resolve: { recipes: recipesResolver },
  },
  {
    path: ':id',
    component: RecipePreviewComponent,
    resolve: { recipe: recipeResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }

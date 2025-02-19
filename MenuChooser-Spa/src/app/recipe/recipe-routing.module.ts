import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { recipesResolver } from './resolvers/recipes.resolver';
import { RecipesListComponent } from './views/recipes-list/recipes-list.component';

const routes: Routes = [
  {
    path: '',
    component: RecipesListComponent,
    resolve: { recipes: recipesResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }

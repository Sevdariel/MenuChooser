import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesListComponent } from './views/recipes-list/recipes-list.component';

const routes: Routes = [
  {
    path: '',
    component: RecipesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }

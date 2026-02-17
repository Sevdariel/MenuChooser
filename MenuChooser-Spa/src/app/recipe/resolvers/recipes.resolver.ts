import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetRecipes } from '../store/recipe.actions';

export const recipesResolver: ResolveFn<Observable<void>> = (route, state) => {
  const recipeStore = inject(Store);

  return recipeStore.dispatch(new GetRecipes());
};

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { IRecipe } from '../models/recipe.model';
import { RecipeMapperService } from '../services/recipe-mapper.service';
import { RecipeService } from '../services/recipe.service';

export const recipeResolver: ResolveFn<IRecipe> = (route, state) => {
  const recipeService = inject(RecipeService);
  const recipeMapperService = inject(RecipeMapperService);

  return recipeService.getRecipe(route.params['id']).pipe(map(recipeDto => recipeMapperService.mapToModel(recipeDto)));
};

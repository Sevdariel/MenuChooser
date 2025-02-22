import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IRecipeDto } from '../models/recipe-dto.model';
import { RecipeService } from '../services/recipe.service';

export const recipeResolver: ResolveFn<IRecipeDto> = (route, state) => {
  const recipeService = inject(RecipeService);

  return recipeService.getRecipe(route.params['id']);
};

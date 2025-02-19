import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IRecipeListItem } from '../models/recipe-dto.model';
import { RecipeService } from './../services/recipe.service';

export const recipesResolver: ResolveFn<IRecipeListItem[]> = (route, state) => {
  const recipeService = inject(RecipeService);

  return recipeService.getRecipes();
};

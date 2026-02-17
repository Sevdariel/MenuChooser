import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IRecipeListItem } from '../models/recipe-dto.model';
import { RecipeService } from '../services/recipe.service';
import { GetRecipes } from './recipe.actions';
import { exhaustMap, tap } from 'rxjs';

interface RecipeStateModel {
  recipes: IRecipeListItem[];
}

@State<RecipeStateModel>({
  name: 'recipe',
  defaults: { recipes: [] },
})
@Injectable()
export class RecipeState {
  private readonly recipeService = inject(RecipeService);

  @Selector()
  public static getRecipes(state: RecipeStateModel): IRecipeListItem[] {
    return state.recipes;
  }
  
  @Action(GetRecipes)
  public getRecipes(ctx: StateContext<RecipeStateModel>, action: GetRecipes) {
    return this.recipeService.getRecipes().pipe(
      tap((recipesResult) => {
        const state = ctx.getState();
        ctx.setState({
          ...state,
          recipes: recipesResult,
        });
      }),
    );
  }
}

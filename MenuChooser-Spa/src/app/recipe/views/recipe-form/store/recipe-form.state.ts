import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, exhaustMap } from 'rxjs/operators';
import { RecipeService } from '../../../../recipe/services/recipe.service';
import { RecipeMapperService } from '../../../../recipe/services/recipe-mapper.service';
import { IRecipe, IRecipeForm } from '../../../../recipe/models/recipe.model';
import { IRecipeDto } from '../../../../recipe/models/recipe-dto.model';
import {
  ClearRecipeForm,
  DeleteRecipe,
  DeleteRecipeError,
  DeleteRecipeSuccess,
  GetRecipe,
  GetRecipeError,
  GetRecipeSuccess,
  SaveRecipe,
  SaveRecipeError,
  SaveRecipeSuccess,
  UpdateRecipe,
  UpdateRecipeError,
  UpdateRecipeLocally,
  UpdateRecipeSuccess,
} from './recipe-form.actions';
import { RecipeFormStateModel } from './recipe-form.state.model';

@State<RecipeFormStateModel>({
  name: 'recipeForm',
  defaults: {
    recipe: null,
    isLoading: false,
    error: null,
  },
})
@Injectable()
export class RecipeFormState {
  constructor(
    private readonly recipeService: RecipeService,
    private readonly recipeMapperService: RecipeMapperService
  ) {}

  @Selector()
  public static recipe(state: RecipeFormStateModel): IRecipe | null {
    return state.recipe;
  }

  @Selector()
  public static isLoading(state: RecipeFormStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  public static error(state: RecipeFormStateModel): string | null {
    return state.error;
  }

  @Selector()
  public static hasError(state: RecipeFormStateModel): boolean {
    return !!state.error;
  }

  @Action(GetRecipe)
  public getRecipe(ctx: StateContext<RecipeFormStateModel>, action: GetRecipe) {
    ctx.patchState({ isLoading: true, error: null });
    return this.recipeService.getRecipe(action.id).pipe(
      exhaustMap((recipeDto: IRecipeDto) => {
        const recipe = this.recipeMapperService.mapToModel(recipeDto);
        return ctx.dispatch(new GetRecipeSuccess(recipe));
      })
    ).pipe(
      catchError((error) => {
        const errorMessage = error?.message || 'An unexpected error occurred';
        return ctx.dispatch(new GetRecipeError(errorMessage));
      })
    );
  }

  @Action(GetRecipeSuccess)
  public getRecipeSuccess(ctx: StateContext<RecipeFormStateModel>, action: GetRecipeSuccess) {
    ctx.patchState({
      recipe: action.recipe,
      isLoading: false,
      error: null,
    });
  }

  @Action(GetRecipeError)
  public getRecipeError(ctx: StateContext<RecipeFormStateModel>, action: GetRecipeError) {
    ctx.patchState({
      isLoading: false,
      error: action.error,
    });
  }

  @Action(SaveRecipe)
  public saveRecipe(ctx: StateContext<RecipeFormStateModel>, action: SaveRecipe) {
    ctx.patchState({ isLoading: true, error: null });
    return this.recipeService.createRecipe(action.createRecipeDto).pipe(
      exhaustMap((recipe: IRecipe) => ctx.dispatch(new SaveRecipeSuccess(recipe)))
    ).pipe(
      catchError((error) => {
        const errorMessage = error?.message || 'An unexpected error occurred';
        return ctx.dispatch(new SaveRecipeError(errorMessage));
      })
    );
  }

  @Action(SaveRecipeSuccess)
  public saveRecipeSuccess(ctx: StateContext<RecipeFormStateModel>, action: SaveRecipeSuccess) {
    ctx.patchState({
      recipe: action.recipe,
      isLoading: false,
      error: null,
    });
    // Navigate to the new recipe
    // Note: This would need router injection in state, which is not ideal
    // Better to handle navigation in component with success subscription
  }

  @Action(SaveRecipeError)
  public saveRecipeError(ctx: StateContext<RecipeFormStateModel>, action: SaveRecipeError) {
    ctx.patchState({
      isLoading: false,
      error: action.error,
    });
  }

  @Action(UpdateRecipe)
  public updateRecipe(ctx: StateContext<RecipeFormStateModel>, action: UpdateRecipe) {
    ctx.patchState({ isLoading: true, error: null });
    return this.recipeService.updateRecipe(action.updateRecipeDto).pipe(
      exhaustMap(() => ctx.dispatch(new UpdateRecipeSuccess()))
    ).pipe(
      catchError((error) => {
        const errorMessage = error?.message || 'An unexpected error occurred';
        return ctx.dispatch(new UpdateRecipeError(errorMessage));
      })
    );
  }

  @Action(UpdateRecipeSuccess)
  public updateRecipeSuccess(ctx: StateContext<RecipeFormStateModel>) {
    ctx.patchState({
      isLoading: false,
      error: null,
    });
  }

  @Action(UpdateRecipeError)
  public updateRecipeError(ctx: StateContext<RecipeFormStateModel>, action: UpdateRecipeError) {
    ctx.patchState({
      isLoading: false,
      error: action.error,
    });
  }

  @Action(DeleteRecipe)
  public deleteRecipe(ctx: StateContext<RecipeFormStateModel>, action: DeleteRecipe) {
    ctx.patchState({ isLoading: true, error: null });
    // Note: RecipeService doesn't have deleteRecipe method yet
    // This would need to be implemented in the service
    ctx.dispatch(new DeleteRecipeError('Delete functionality not implemented yet'));
    return Promise.resolve();
  }

  @Action(DeleteRecipeSuccess)
  public deleteRecipeSuccess(ctx: StateContext<RecipeFormStateModel>) {
    ctx.patchState({
      recipe: null,
      isLoading: false,
      error: null,
    });
  }

  @Action(DeleteRecipeError)
  public deleteRecipeError(ctx: StateContext<RecipeFormStateModel>, action: DeleteRecipeError) {
    ctx.patchState({
      isLoading: false,
      error: action.error,
    });
  }

  @Action(ClearRecipeForm)
  public clearRecipeForm(ctx: StateContext<RecipeFormStateModel>) {
    ctx.patchState({
      recipe: null,
      error: null,
    });
  }

  @Action(UpdateRecipeLocally)
  public updateRecipeLocally(ctx: StateContext<RecipeFormStateModel>, action: UpdateRecipeLocally) {
    ctx.patchState({
      recipe: action.recipe,
    });
  }

}

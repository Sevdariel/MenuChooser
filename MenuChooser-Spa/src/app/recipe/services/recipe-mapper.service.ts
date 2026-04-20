import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ICreateRecipeDto,
  IRecipeDto,
  IStepDto,
  IUpdateRecipeDto,
} from '../models/recipe-dto.model';
import {
  IRecipe,
  IRecipeForm,
  IRecipeProduct,
  IStep,
  MealType,
  RecipeStepsFormType,
} from '../models/recipe.model';
import { AuthService } from '../../core/authorization/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeMapperService {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  public mapToModel(recipeDto: IRecipeDto): IRecipe {
    return {
      createdBy: recipeDto.createdBy,
      duration: recipeDto.duration,
      id: recipeDto.id,
      name: recipeDto.name,
      products: recipeDto.products,
      steps: recipeDto.steps.map(
        (stepDto: IStepDto) =>
          ({
            content: stepDto.content,
            duration: stepDto.duration,
            order: stepDto.order,
            products: (stepDto.productIds || [])
              .map((productId) => ({
                product: recipeDto.products.find(
                  (p) => p.product.id === productId,
                )?.product,
                quantity: 1,
              }))
              .filter((p): p is IRecipeProduct => !!p.product),
          }) as IStep,
      ),
      updatedBy: recipeDto.updatedBy,
      mealType: recipeDto.mealType,
      servings: recipeDto.servings,
      caloriesPerServing: recipeDto.caloriesPerServing,
      tags: recipeDto.tags,
    };
  }

  public mapStepsToFormArray(
    steps: IStep[],
  ): FormArray<FormGroup<RecipeStepsFormType>> {
    return this.formBuilder.array(
      steps.map((step) => {
        return this.formBuilder.group({
          order: new FormControl(step.order),
          content: new FormControl(step.content),
          duration: new FormControl(step.duration),
          products: new FormControl(
            step.products.map(
              (product) =>
                <IRecipeProduct>{
                  product: product.product,
                  quantity: 1,
                },
            ),
          ),
        });
      }),
    );
  }

  public mapToCreateRecipeDto(recipe: IRecipeForm): ICreateRecipeDto {
    return {
      name: recipe.name || '',
      duration: recipe.duration || 0,
      recipeProducts:
        recipe.products?.map((product: IRecipeProduct) => ({
          productId: product.product.id,
          quantity: product.quantity,
          unit: product.unit,
        })) || [],
      steps:
        recipe.steps?.map((step: IStep) => ({
          order: step.order,
          content: step.content,
          duration: step.duration,
          productIds: step.products.map(
            (product: IRecipeProduct) => product.product.id,
          ),
        })) || [],
      mealType: recipe.mealType || MealType.Dinner,
      createdBy: this.authService.loggedUser()?.username || '',
      servings: recipe.servings || undefined,
      caloriesPerServing: recipe.caloriesPerServing || undefined,
      tags: recipe.tags || undefined,
    };
  }

  public mapToUpdateRecipeDto(recipe: IRecipeForm, recipeId: string): IUpdateRecipeDto {
    return {
      id: recipeId,
      name: recipe.name || '',
      duration: recipe.duration || 0,
      recipeProducts:
        recipe.products?.map((product: IRecipeProduct) => ({
          productId: product.product.id,
          quantity: product.quantity,
          unit: product.unit,
        })) || [],
      steps:
        recipe.steps?.map((step: IStep) => ({
          order: step.order,
          content: step.content,
          duration: step.duration,
          productIds: step.products.map(
            (product: IRecipeProduct) => product.product.id,
          ),
        })) || [],
      updatedBy: this.authService.loggedUser()?.username || '',
      mealType: recipe.mealType || MealType.Dinner,
      servings: recipe.servings || undefined,
      caloriesPerServing: recipe.caloriesPerServing || undefined,
      tags: recipe.tags || undefined,
    };
  }
}

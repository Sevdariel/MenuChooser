import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ICreateRecipeDto,
  IRecipeDto,
  IStepDto,
} from '../models/recipe-dto.model';
import {
  IRecipe,
  IRecipeProduct,
  IStep,
  MealType,
  RecipeStepsFormType,
} from '../models/recipe.model';
import { AuthService } from '../../core/authorization/auth.service';
import { IRecipeForm } from '../models/recipe-form.model';

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
      mealType: MealType.Appetizer, // To do
      createdBy: this.authService.loggedUser()?.username || '',
    };
  }
}

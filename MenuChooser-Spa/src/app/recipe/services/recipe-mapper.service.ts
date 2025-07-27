import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IRecipeDto, IStepDto } from '../models/recipe-dto.model';
import { IRecipe, IRecipeProduct, IStep, RecipeStepsFormType } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeMapperService {
  private readonly formBuilder = inject(FormBuilder);

  public mapToModel(recipeDto: IRecipeDto): IRecipe {
    return {
      createdBy: recipeDto.createdBy,
      duration: recipeDto.duration,
      id: recipeDto.id,
      name: recipeDto.name,
      products: recipeDto.products,
      steps: recipeDto.steps.map((stepDto: IStepDto) => ({
        content: stepDto.content,
        duration: stepDto.duration,
        order: stepDto.order,
        products: (stepDto.productIds || []).map(productId => ({
          product: recipeDto.products.find(p => p.product.id === productId)?.product,
          quantity: 1
        })).filter((p): p is IRecipeProduct => !!p.product),
      } as IStep)),
      updatedBy: recipeDto.updatedBy,
    };
  }

  // public mapStepToFormGroup(step: Partial<IStep>): FormGroup<RecipeStepsFormType> {
  //   return this.formBuilder.nonNullable.group({
  //     order: [step.order ?? 0],
  //     content: [step.content ?? ''],
  //     duration: [step.duration ?? 0],
  //     products: [step.products ?? []],
  //   });
  // }

  // public mapStepsToFormArray(steps: IStep[]): FormArray<FormGroup<RecipeStepsFormType>> {
  //   return this.formBuilder.array(steps.map(step => this.mapStepToFormGroup(step)));
  // }

  public mapStepsToFormArray(steps: IStep[]): FormArray<FormGroup<RecipeStepsFormType>> {
    return this.formBuilder.array(steps.map(step => {
      return this.formBuilder.group({
        order: new FormControl(step.order),
        content: new FormControl(step.content),
        duration: new FormControl(step.duration),
        products: new FormControl(step.products.map(product => <IRecipeProduct>{
          product: product.product,
          quantity: 1
        })),
      })
    }))
  }
}

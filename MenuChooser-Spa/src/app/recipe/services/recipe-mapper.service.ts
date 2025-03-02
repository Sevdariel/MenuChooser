import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IRecipeDto, IStepDto } from '../models/recipe-dto.model';
import { IRecipe, IStep, RecipeStepsFormType } from '../models/recipe.model';

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
      steps: recipeDto.steps.map((stepDto: IStepDto) => <IStep>{
        content: stepDto.content,
        duration: stepDto.duration,
        order: stepDto.order,
        products: stepDto.productIds ? stepDto.productIds?.map(productId => recipeDto.products.find(product => product.id === productId)) : [],
      }),
      updatedBy: recipeDto.updatedBy,
    }
  }

  public mapStepsToFormArray(steps: IStep[]): FormArray<FormGroup<RecipeStepsFormType>> {
    return this.formBuilder.array(steps.map(step => {
      return this.formBuilder.group({
        order: new FormControl(step.order),
        content: new FormControl(step.content),
        duration: new FormControl(step.duration),
        products: new FormControl(step.products),
      })
    }))
  }
}

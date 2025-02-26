import { Injectable } from '@angular/core';
import { IRecipeDto, IStepDto } from '../models/recipe-dto.model';
import { IRecipe, IStep } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeMapperService {

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
        products: stepDto.productIds?.map(productId => recipeDto.products.find(product => product.id === productId)),
      }),
      updatedBy: recipeDto.updatedBy,
    }
  }
}

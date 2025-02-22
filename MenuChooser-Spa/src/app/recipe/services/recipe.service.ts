import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRecipeDto, IRecipeListItem } from '../models/recipe-dto.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly httpClient = inject(HttpClient);
  
  private readonly baseUrl = `api/recipe`;

  public getRecipes() {
    return this.httpClient.get<IRecipeListItem[]>(this.baseUrl);
  }
  
  public getRecipe(id: string) {
    return this.httpClient.get<IRecipeDto>(`${this.baseUrl}/${id}`);
  }
}

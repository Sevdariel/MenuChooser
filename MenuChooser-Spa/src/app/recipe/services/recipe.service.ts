import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRecipeListItem } from '../models/recipe-dto.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly httpClient = inject(HttpClient);
  
  private readonly baseUrl = `api/recipe`;

  public getRecipes() {
    return this.httpClient.get<IRecipeListItem[]>(this.baseUrl);
  }
  
}

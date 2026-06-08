import { Injectable } from '@angular/core';
import { Menu } from '../models/menu.model';
import { MenuGenerateRequest, MealConfigDto } from '../models/menu-dto.model';

@Injectable({
  providedIn: 'root',
})
export class MenuGenerateMapper {
  static toDto(meals: Menu[], dateFrom: string, dateTo: string): MenuGenerateRequest {
    return {
      meals: meals.map((meal: Menu): MealConfigDto => ({
        type: meal.type,
        name: meal.name,
        enabled: meal.enabled,
        time: meal.time,
      })),
    };
  }
}

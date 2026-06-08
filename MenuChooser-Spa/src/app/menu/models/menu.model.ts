export interface Menu {
  type: MealType;
  name: string;
  time: string;
  icon: string;
  iconBackground: string;
  enabled: boolean;
}

export enum MealType {
  Breakfast = 'Breakfast',
  Dinner = 'Dinner',
  Lunch = 'Lunch',
  Appetizer = 'Appetizer',
  Dessert = 'Dessert',
}

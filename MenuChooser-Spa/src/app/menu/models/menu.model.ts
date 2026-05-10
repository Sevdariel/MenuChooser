export interface Menu {
  type: MealType;
  name: string;
  time: string;
  icon: string;
  iconBackground: string;
  enabled: boolean;
}

export enum MealType {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Snack = 'snack',
  Dinner = 'dinner',
}

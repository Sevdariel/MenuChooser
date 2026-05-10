import { MealType, Menu } from './menu.model';

export const MenuDefault: Menu[] = [
  {
    type: MealType.Breakfast,
    name: 'Śniadanie',
    time: '7:00 – 9:00',
    icon: '🌅',
    iconBackground: 'rgba(212,132,90,0.1)',
    enabled: true,
  },
  {
    type: MealType.Lunch,
    name: 'Obiad',
    time: '12:00 – 14:00',
    icon: '☀️',
    iconBackground: 'rgba(106,145,99,0.1)',
    enabled: true,
  },
  {
    type: MealType.Snack,
    name: 'Podwieczorek',
    time: '15:00 – 17:00',
    icon: '🍎',
    iconBackground: 'rgba(160,112,96,0.08)',
    enabled: false,
  },
  {
    type: MealType.Dinner,
    name: 'Kolacja',
    time: '18:00 – 20:00',
    icon: '🌙',
    iconBackground: 'rgba(92,61,46,0.08)',
    enabled: true,
  },
];

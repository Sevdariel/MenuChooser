import { Component, signal } from '@angular/core';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, RecipeFormType } from '../../models/recipe.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'mc-recipe-add',
  imports: [],
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.scss'
})
export class RecipeAddComponent {

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  public formGroup!: FormGroup<RecipeFormType>;

  public create() {

  }
}

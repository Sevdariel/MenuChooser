import { Component, inject, OnInit, signal } from '@angular/core';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, RecipeFormType } from '../../models/recipe.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'mc-recipe-add',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    ButtonModule
  ],
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.scss'
})
export class RecipeAddComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  public formGroup!: FormGroup<RecipeFormType>;

  public ngOnInit(): void {
    // this.formGroup = this.formBuilder.group({
    //   duration: new FormControl(),
    //   name: new FormControl(''),
    //   products: new FormControl(),
    //   steps: this.formBuilder.array()
    // })
  }

  public add() {

  }
}

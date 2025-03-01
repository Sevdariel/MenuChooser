import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../../core/authorization/auth.service';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, RecipeFormType } from '../../models/recipe.model';
import { IUpdateRecipeDto } from '../../models/recipe-dto.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'mc-recipe-edit',
  imports: [
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TableModule,
  ],
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.scss',
})
export class RecipeEditComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public recipe = input(defaultRecipe);
  public saved = output<IRecipe>();

  protected formGroup!: FormGroup<RecipeFormType>;
  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(this.recipe().name),
      duration: new FormControl(this.recipe().duration),
      products: this.formBuilder.array(this.recipe().products.map(product => this.formBuilder.group(product))),
      steps: new FormControl(this.recipe().steps),
    });
  }

  public save() {
    console.log('Recipe edit component save()');
    // const updateRecipeDto: IUpdateRecipeDto = {
    //   name: this.formGroup.controls.name.value!,
    //   products: this.formGroup.controls.products.value!,
    //   // steps: this.formGroup.controls.steps.value!,
    //   updatedBy: this.authService.loggedUser()!.username,
    // }

    // this.recipeService.updateRecipe(updateRecipeDto).pipe(
    //   tap(() => this.saved.emit(updateRecipeDto)),
    //   takeUntilDestroyed(this.destroyRef))
    //   .subscribe();
  }
}

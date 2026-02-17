import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../core/authorization/auth.service';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, IStep, RecipeFormType } from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'mc-recipe-edit',
  imports: [
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TableModule,
    DataViewModule,
    AutoCompleteModule,
    TextareaModule,
    FloatLabelModule,
    MultiSelectModule,
  ],
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeEditComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeService = inject(RecipeService);
  private readonly recipeMapperService = inject(RecipeMapperService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public recipe = input(defaultRecipe);
  public saved = output<IRecipe>();

  protected formGroup!: FormGroup<RecipeFormType>;
  public recipeProducts = computed(() => this.formGroup.controls.products.value);

  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(this.recipe().name),
      duration: new FormControl(this.recipe().duration),
      products: new FormControl(this.recipe().products),
      steps: new FormControl<IStep[]>(this.recipe().steps),
    });
  }

  public save() {
    // const formGroupRawValue = this.formGroup.getRawValue();
    // const updateRecipeDto: IUpdateRecipeDto = {
    //   ...this.recipe(),
    //   duration: this.formGroup.controls.duration.value!,
    //   name: this.formGroup.controls.name.value!,
    //   productIds: this.formGroup.controls.products.getRawValue().map(product => product.id!),
    //   updatedBy: this.authService.loggedUser()?.username!,
    //   steps: this.formGroup.controls.steps.getRawValue().map(({ products, ...step }) => <IStepDto>{
    //     ...step,
    //     productIds: products?.map(product => product.id),
    //   }),
    // }

    // const resultRecipe: IRecipe = {
    //   ...this.recipe(),
    //   duration: formGroupRawValue.duration!,
    //   name: formGroupRawValue.name!,
    //   products: this.formGroup.controls.products.getRawValue().map(product => <IRecipeProduct>{
    //     id: product.id,
    //     name: product.name,
    //   })!,
    //   steps: this.formGroup.controls.steps.getRawValue().map(step => <IStep>{
    //     content: step.content,
    //     duration: step.duration,
    //     order: step.order,
    //     products: step.products?.map(product => <IRecipeProduct>{
    //       id: product.id,
    //       name: product.name,
    //     })
    //   })!,
    // }

    // this.recipeService.updateRecipe(updateRecipeDto).pipe(
    //   tap(() => this.saved.emit(resultRecipe)),
    //   takeUntilDestroyed(this.destroyRef))
    //   .subscribe();
  }
}

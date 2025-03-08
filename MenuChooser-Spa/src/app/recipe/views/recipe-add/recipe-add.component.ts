import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, RecipeFormType } from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';

@Component({
  selector: 'mc-recipe-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabel,
    ButtonModule,
    InputTextModule,
    TableModule,
    SvgIconComponent,
    TooltipModule,
  ],
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.scss'
})
export class RecipeAddComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeMapperService = inject(RecipeMapperService);

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
  ];

  public formGroup!: FormGroup<RecipeFormType>;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      duration: new FormControl(),
      name: new FormControl(''),
      products: this.formBuilder.array(this.recipe().products.map(product => this.formBuilder.group(product))),
      steps: this.recipeMapperService.mapStepsToFormArray(this.recipe().steps),
    })
  }

  public addProduct() {
    this.formGroup.controls.products.push(this.formBuilder.group({
      id: new FormControl(),
      name: new FormControl(),
    }));

    setTimeout(() => {
      const lastRowIndex = this.formGroup.controls.products.controls.length - 1;

      const selector = `tr[data-row-index="${lastRowIndex}"] td.p-editable-column`;
      const editableCell: HTMLElement = document.querySelector(selector)!;

      editableCell.click();
    }, 0);
  }

  public saveRecipe() {

  }
}

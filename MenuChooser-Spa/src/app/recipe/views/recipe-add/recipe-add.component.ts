import { Component, ElementRef, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, RecipeFormType } from '../../models/recipe.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { InputTextModule } from 'primeng/inputtext';
import { EditableColumn, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { TooltipModule } from 'primeng/tooltip';

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

  @ViewChildren('productInput') productInputs!: QueryList<ElementRef>;

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
      console.log('kurwa')
      const inputs = this.productInputs.toArray();
      console.log(inputs)
      if (inputs.length) {
        console.log(inputs[inputs.length - 1])
        inputs[inputs.length - 1].nativeElement.focus();
      }
    }, 0);

  }

  public saveRecipe() {

  }
}

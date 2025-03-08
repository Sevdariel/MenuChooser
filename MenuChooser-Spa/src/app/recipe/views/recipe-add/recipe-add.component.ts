import { Component, ElementRef, inject, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe, RecipeFormType } from '../../models/recipe.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { InputTextModule } from 'primeng/inputtext';
import { EditableColumn, TableModule, Table } from 'primeng/table';
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
  @ViewChildren('cellEditor') cellEditor!: QueryList<ElementRef>;
  @ViewChild('dt') dt!: Table;

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
      name: new FormControl(''),
    }));

    setTimeout(() => {
      const lastRowIndex = this.formGroup.controls.products.controls.length - 1;
      const lastProduct = this.formGroup.controls.products.at(lastRowIndex);
      
      if (this.dt) {
        console.log('Tabela znaleziona, próbuję inicjować edycję');
        this.dt.initRowEdit(lastProduct);
      } else {
        console.log('Nie znaleziono referencji do tabeli');
      }
      
      const selector = `tr[data-row-index="${lastRowIndex}"] td[data-field="name"]`;
      const cell = document.querySelector(selector);
      if (cell instanceof HTMLElement) {
        console.log('Znaleziono komórkę po atrybutach danych, klikam');
        cell.click();
      }
    }, 50);
  }

  public saveRecipe() {

  }
}

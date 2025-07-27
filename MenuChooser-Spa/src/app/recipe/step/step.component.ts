import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { RecipeStepsFormType } from '../models/recipe.model';

@Component({
  selector: 'mc-step',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    MultiSelectModule,
    ReactiveFormsModule,
    TextareaModule,
  ],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class StepComponent {
  @Input() stepFormGroup!: FormGroup<RecipeStepsFormType>;
  @Input() availableProducts: any[] = [];
}

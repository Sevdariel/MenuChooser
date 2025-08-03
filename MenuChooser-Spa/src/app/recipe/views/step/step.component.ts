import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { IRecipeProduct, IStep } from '../../models/recipe.model';

@Component({
  selector: 'mc-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    TextareaModule,
    FloatLabelModule
  ],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class StepComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder);

  public availableProducts = input<IRecipeProduct[]>();
  public step = model<IStep | null>(null);

  public formGroup!: FormGroup;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      order: [this.step()?.order],
      content: [this.step()?.content],
      duration: [this.step()?.duration],
      products: [this.step()?.products]
    });
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.step.set(this.formGroup.getRawValue());
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { tap } from 'rxjs';
import { DrawerContent } from '../../../shared/drawer/drawer.model';
import { DrawerService } from '../../../shared/drawer/drawer.service';
import { flattenObject } from '../../../shared/helpers/flatten-object';
import { upsertByPath } from '../../../shared/helpers/upsert-item';
import { defaultRecipeForm } from '../../models/default-recipe.model';
import { ICreateRecipeDto } from '../../models/recipe-dto.model';
import { IRecipeForm } from '../../models/recipe-forms.model';
import { IRecipeProduct, IStep } from '../../models/recipe.model';
import { RecipeMapperService } from '../../services/recipe-mapper.service';
import { RecipeService } from '../../services/recipe.service';
import { RecipeProductComponent } from '../recipe-product/recipe-product.component';
import { StepComponent } from '../step/step.component';

@Component({
  selector: 'mc-recipe-add',
  imports: [
    ButtonModule,
    CommonModule,
    DrawerModule,
    FloatLabel,
    FormField,
    InputNumberModule,
    InputTextModule,
    RecipeProductComponent,
    TableModule,
    StepComponent,
  ],
  templateUrl: './recipe-add.component.html',
  styleUrl: './recipe-add.component.scss',
})
export class RecipeAddComponent {
  public readonly drawerService = inject(DrawerService);
  private readonly recipeMapperService = inject(RecipeMapperService);
  private readonly recipeService = inject(RecipeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public selectedProduct = signal<IRecipeProduct | null>(null);
  public selectedStep = signal<IStep | null>(null);

  public togglePanel = signal<boolean>(false);
  public toggleProductPanel = signal<boolean>(false);
  public toggleStepPanel = signal<boolean>(false);

  protected readonly productColumns = [
    { field: 'name', caption: 'Name' },
    { field: 'quantity', caption: 'Quantity' },
  ];
  protected readonly stepColumns = [
    { field: 'content', caption: 'Content' },
    { field: 'duration', caption: 'Duration' },
  ];
  protected drawerContent = DrawerContent;
  
  protected recipeModel = signal<IRecipeForm>(defaultRecipeForm);
  protected signalForm = form(this.recipeModel);

  public draggedStepIndex: number | null = null;

  public displayValue(recipeProduct: IRecipeProduct, field: string) {
    const flat = flattenObject(recipeProduct);
    return flat[field];
  }

  public openRecipeProductPreview(recipeProduct: IRecipeProduct | null) {
    this.selectedProduct.set(recipeProduct);
    this.drawerService.toggleDrawerPannel(DrawerContent.RecipeProduct);
  }

  public openStepPreview(step: IStep | null) {
    this.selectedStep.set(step);
    this.drawerService.toggleDrawerPannel(DrawerContent.Step);
  }

  public onRecipeProductSave(recipeProduct: IRecipeProduct | null) {
    this.drawerService.toggleDrawerPannel(DrawerContent.None);
    if (!!recipeProduct) {
      this.recipeModel.update((recipe) => ({
        ...recipe,
        products: upsertByPath(recipe.products, recipeProduct, 'product.id'),
      }));

      this.selectedProduct.set(null);
    }
  }

  public drawerHeader() {
    switch (this.drawerService.contentVisible()) {
      case DrawerContent.RecipeProduct:
        return this.selectedProduct() ? 'Edit Product' : 'Add Product';
      case DrawerContent.Step:
        return this.selectedStep() ? 'Edit Step' : 'Add Step';
      default:
        return '';
    }
  }

  public onStepSave(step: IStep | null) {
    if (!!step) {
      this.recipeModel.update((recipe) => ({
        ...recipe,
        steps: upsertByPath(recipe.steps, step, 'step.id'),
      }));

      this.selectedStep.set(null);
      this.drawerService.toggleDrawerPannel(DrawerContent.None);
    }
  }

  public saveRecipe(event: Event) {
    event.preventDefault();
    const createRecipeDto: ICreateRecipeDto =
      this.recipeMapperService.mapToCreateRecipeDto(this.recipeModel());

    this.recipeService
      .createRecipe(createRecipeDto)
      .pipe(
        tap((newRecipe) => this.router.navigate([`/recipes/${newRecipe.id}`])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}

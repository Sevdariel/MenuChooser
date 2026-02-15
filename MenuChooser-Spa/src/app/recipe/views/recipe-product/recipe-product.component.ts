import {
  Component,
  DestroyRef,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { tap } from 'rxjs';
import { IProduct } from '../../../product/models/product.model';
import { ProductService } from '../../../product/services/product.service';
import { defaultRecipeProductForm } from '../../models/default-recipe.model';
import { IRecipeProductForm } from '../../models/recipe-forms.model';
import { IRecipeProduct } from '../../models/recipe.model';

@Component({
  selector: 'mc-recipe-product',
  standalone: true,
  imports: [AutoCompleteModule, ButtonModule, InputNumberModule, FormField],
  templateUrl: './recipe-product.component.html',
  styleUrl: './recipe-product.component.scss',
})
export class RecipeProductComponent {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  public product = model<IRecipeProduct | null>(null);
  public closeDrawer = output<IRecipeProduct | null>();
  public suggestionProducts = signal<IProduct[]>([]);
  
  protected recipeProductModel = signal<IRecipeProductForm>(
    defaultRecipeProductForm,
  );
  protected signalForm = form(this.recipeProductModel);

  onSave(event: Event) {
    event.preventDefault();

    if (this.signalForm().valid()) {
      this.closeDrawer.emit(this.recipeProductModel());
    }
  }

  public search(event: any) {
    this.productService
      .getFilteredProducts(event.query)
      .pipe(
        tap((products) => this.suggestionProducts.set(products)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}

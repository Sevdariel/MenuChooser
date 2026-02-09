import {
  Component,
  DestroyRef,
  inject,
  model,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  imports: [AutoCompleteModule, ButtonModule, InputNumberModule, ReactiveFormsModule],
  templateUrl: './recipe-product.component.html',
  styleUrl: './recipe-product.component.scss',
})
export class RecipeProductComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  public product = model<IRecipeProduct | null>(null);
  public closeDrawer = output<IRecipeProduct | null>();
  public suggestionProducts = signal<IProduct[]>([]);
  
  public recipeForm!: FormGroup;

  ngOnInit() {
    this.recipeForm = this.fb.group({
      product: [defaultRecipeProductForm.product],
      quantity: [defaultRecipeProductForm.quantity],
      unit: [defaultRecipeProductForm.unit],
    });
  }

  onSave(event: Event) {
    event.preventDefault();

    if (this.recipeForm.valid) {
      this.closeDrawer.emit(this.recipeForm.value);
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

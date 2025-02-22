import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe } from '../../models/recipe.model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mc-recipe-preview',
  imports: [
    CardModule,
  ],
  templateUrl: './recipe-preview.component.html',
  styleUrl: './recipe-preview.component.scss'
})
export class RecipePreviewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.recipeSignal.set(data['recipe'])),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}

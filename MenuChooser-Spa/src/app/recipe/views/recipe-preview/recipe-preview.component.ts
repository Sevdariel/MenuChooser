import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { tap } from 'rxjs';
import { defaultRecipe } from '../../models/default-recipe.model';
import { IRecipe } from '../../models/recipe.model';

@Component({
  selector: 'mc-recipe-preview',
  imports: [
    CardModule,
    DrawerModule,
    SvgIconComponent,
    TableModule,
    ButtonModule,
  ],
  templateUrl: './recipe-preview.component.html',
  styleUrl: './recipe-preview.component.scss'
})
export class RecipePreviewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private recipeSignal = signal<IRecipe>(defaultRecipe);
  public recipe = this.recipeSignal.asReadonly();
  public togglePanel = false;

  public productColumns = [
    { field: 'name', header: 'Name' },
  ]

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.recipeSignal.set(data['recipe'])),
      tap(() => console.log(this.recipe())),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public updateRecipe(updatedRecipe: IRecipe) {
    this.recipeSignal.update(() => updatedRecipe);
    this.togglePanel = false;
  }
}

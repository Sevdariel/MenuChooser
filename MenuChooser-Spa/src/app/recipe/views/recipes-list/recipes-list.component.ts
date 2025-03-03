import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { tap } from 'rxjs';
import { IRecipeListItem } from './../../models/recipe-dto.model';

@Component({
  selector: 'mc-recipes-list',
  imports: [
    SvgIconComponent,
    ButtonModule,
    TableModule,
    DrawerModule,
  ],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private recipesSignal = signal<IRecipeListItem[]>([]);
  public recipes = this.recipesSignal.asReadonly();

  public readonly columns = [
    { field: 'name', header: 'Name' },
    { field: 'duration', header: 'Duration' },
    { field: 'mealType', header: 'Meal type' },
  ];

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(
      tap(data => this.recipesSignal.set(data['recipes'])),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  public openRecipePreview(recipeId: string) {
    this.router.navigate([`${this.router.url}/${recipeId}`]);
  }

  public addNewRecipe() {
    this.router.navigate([`${this.router.url}/new`]);
    }
}

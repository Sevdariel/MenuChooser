import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { GetRecipeSuccess } from '../recipe-form/store/recipe-form.actions';
import { RecipeFormState } from '../recipe-form/store/recipe-form.state';

@Component({
  selector: 'mc-recipe-shell',
  standalone: true,
  imports: [
    CommonModule,
    RecipeFormComponent,
  ],
  templateUrl: './recipe-shell.component.html',
  styleUrl: './recipe-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeShellComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public recipe = this.store.selectSignal(RecipeFormState.recipe);
  
  public ngOnInit(): void {
    this.loadRecipeFromResolver();
  }

  private loadRecipeFromResolver(): void {
    const routeData = this.activatedRoute.snapshot.data['recipe'];
    if (routeData) {
      // Load recipe from resolver into NGXS state
      this.store.dispatch(new GetRecipeSuccess(routeData));
    }
  }

  public switchToPreviewMode(): void {
    // This method is kept for compatibility but the mode switching is now handled internally
    // by the recipe-form component
  }
}

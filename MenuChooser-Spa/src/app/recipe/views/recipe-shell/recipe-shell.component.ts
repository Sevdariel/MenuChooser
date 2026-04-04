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
import { RecipePreviewComponent } from '../recipe-preview/recipe-preview.component';
import { GetRecipeSuccess } from '../recipe-form/store/recipe-form.actions';
import { RecipeFormState } from '../recipe-form/store/recipe-form.state';

export enum RecipeViewMode {
  PREVIEW = 'preview',
  EDIT = 'edit',
}

@Component({
  selector: 'mc-recipe-shell',
  standalone: true,
  imports: [
    CommonModule,
    RecipePreviewComponent,
    RecipeFormComponent,
  ],
  templateUrl: './recipe-shell.component.html',
  styleUrl: './recipe-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeShellComponent implements OnInit {
  public readonly RecipeViewMode = RecipeViewMode;
  
  private readonly store = inject(Store);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public recipe = this.store.selectSignal(RecipeFormState.recipe);
  public viewMode = signal<RecipeViewMode>(RecipeViewMode.PREVIEW);
  
  // Linked signals to determine mode based on recipe existence
  public isEditMode = linkedSignal(() => this.viewMode() === RecipeViewMode.EDIT);
  public isPreviewMode = linkedSignal(() => this.viewMode() === RecipeViewMode.PREVIEW);

  public ngOnInit(): void {
    this.loadRecipeFromResolver();
    this.initializeMode();
  }

  private loadRecipeFromResolver(): void {
    const routeData = this.activatedRoute.snapshot.data['recipe'];
    if (routeData) {
      // Load recipe from resolver into NGXS state
      this.store.dispatch(new GetRecipeSuccess(routeData));
    }
  }

  private initializeMode(): void {
    // Default to preview mode for existing recipes
    // Can be changed based on URL params or other logic if needed
    this.viewMode.set(RecipeViewMode.PREVIEW);
  }

  public switchToEditMode(): void {
    this.viewMode.set(RecipeViewMode.EDIT);
  }

  public switchToPreviewMode(): void {
    this.viewMode.set(RecipeViewMode.PREVIEW);
  }
}

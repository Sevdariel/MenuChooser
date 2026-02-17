import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeState } from './store/recipe.store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    NgxsModule.forFeature([RecipeState])
  ],
  providers: [RecipeState]
})
export class RecipeModule { }

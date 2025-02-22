import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'mc-recipe-preview',
  imports: [
    CardModule,
  ],
  templateUrl: './recipe-preview.component.html',
  styleUrl: './recipe-preview.component.scss'
})
export class RecipePreviewComponent {

}

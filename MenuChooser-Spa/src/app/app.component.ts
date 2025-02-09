import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        NavBarComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MenuChooser-Spa';
}

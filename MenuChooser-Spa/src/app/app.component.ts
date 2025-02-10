import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { AuthService } from './core/authorization/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  private authService = inject(AuthService);

  title = 'MenuChooser-Spa';

  public ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.logout();
    }
  }
}

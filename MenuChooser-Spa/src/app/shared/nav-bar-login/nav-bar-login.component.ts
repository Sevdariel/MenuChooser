import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mc-nav-bar-login',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar-login.component.html',
  styleUrl: './nav-bar-login.component.scss'
})
export class NavbarLoginComponent {

  constructor(private router: Router) { }

  public login() {
    this.router.navigate(['/account/login']);
  }

  public signUp() {
    this.router.navigate(['/account/sign-up']);
  }
}

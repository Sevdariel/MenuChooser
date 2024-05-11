import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'mc-nav-bar-login',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar-login.component.html',
  styleUrl: './nav-bar-login.component.scss'
})
export class NavbarLoginComponent {

  constructor(private accountService: AccountService) { }

  public login() {
    // this.accountService.login();
  }
}

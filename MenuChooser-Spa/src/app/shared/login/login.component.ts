import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'mc-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private accountService: AccountService) { }

  public login() {
    this.accountService.login();
  }
}

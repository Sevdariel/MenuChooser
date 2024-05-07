import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { IDropdownItem, IDropdownSettings } from '../dropdown-menu/models/dropdown-menu.model';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'mc-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    DropdownMenuComponent,
    LoginComponent,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  constructor(public accountService: AccountService) { }

  public dropdownSettings: IDropdownSettings = {
    id: 'nav-bar-profile',
    iconSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }

  public dropdownList: Array<IDropdownItem> = [
    {
      linkDestination: '#',
      name: 'Your Profile 1'
    },
    {
      linkDestination: '#',
      name: 'Settings 1'
    },
    {
      linkDestination: '#',
      name: 'Sign out 1'
    }
  ];
}

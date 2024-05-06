import { Component } from '@angular/core';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { IDropdownItem, IDropdownSettings } from '../dropdown-menu/models/dropdown-menu.model';

@Component({
  selector: 'mc-nav-bar',
  standalone: true,
  imports: [
    DropdownMenuComponent,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  public dropdownSettings: IDropdownSettings = {
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

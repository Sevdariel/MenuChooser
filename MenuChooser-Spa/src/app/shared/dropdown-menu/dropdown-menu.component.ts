import { Component, Input } from '@angular/core';
import { IDropdownItem, IDropdownSettings } from './models/dropdown-menu.model';
import { DropdownToggleDirective } from './dropdown-directive/dropdown-toggle.directive';

@Component({
  selector: 'mc-dropdown-menu',
  standalone: true,
  imports: [
    DropdownToggleDirective,
  ],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss'
})
export class DropdownMenuComponent {

  @Input()
  public dropdownSettings: IDropdownSettings | undefined = {
    iconSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    mainText: 'kappa'
  }

  @Input()
  public dropdownList: Array<IDropdownItem> | undefined = [
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

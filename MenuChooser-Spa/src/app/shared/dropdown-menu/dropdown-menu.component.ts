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
  public dropdownSettings!: IDropdownSettings;

  @Input()
  public dropdownList!: Array<IDropdownItem>;
}

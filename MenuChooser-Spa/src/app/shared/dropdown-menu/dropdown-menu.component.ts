import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DropdownToggleDirective } from './dropdown-directive/dropdown-toggle.directive';
import { IDropdownItem, IDropdownSettings } from './models/dropdown-menu.model';

@Component({
    selector: 'mc-dropdown-menu',
    imports: [
        CommonModule,
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

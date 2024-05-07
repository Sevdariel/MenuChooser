import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[mcDropdownToggle]',
  standalone: true
})
export class DropdownToggleDirective {

  @Input()
  public connectedElementId!: string;

  constructor(
    private toggleElement: ElementRef,
  ) { }

  @HostListener('click')
  public onMouserClick() {
    this.toggleElement.nativeElement.focus();
  }

  @HostListener('focus')
  public onElementFocus() {
    document.getElementById(this.connectedElementId)?.classList.replace('invisible', 'visible');
  }

  @HostListener('blur')
  public onElementBlur() {
    document.getElementById(this.connectedElementId)?.classList.replace('visible', 'invisible')
  }
}

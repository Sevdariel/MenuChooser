import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[mcDropdownToggle]',
  standalone: true
})
export class DropdownToggleDirective {

  @Input()
  public connectedElement: string | undefined;

  constructor(
    private toggleElement: ElementRef,
  ) {
    console.log(this.toggleElement.nativeElement.focus())
    this.toggleElement.nativeElement.focus();
   }
   
   @Input()
   set focus(focus: boolean) {
    if (focus) {
      this.toggleElement.nativeElement.focus();
    }
   }

  @HostListener('focus')
  public onElementFocus() {
    this.highlight('black')
    console.log('focus');
  }

  @HostListener('blur')
  public onElementBlur() {
    this.highlight('');
    console.log('blur');
  }

  private highlight(color: string) {
    this.toggleElement.nativeElement.style.backgroundColor = color;
  }

}

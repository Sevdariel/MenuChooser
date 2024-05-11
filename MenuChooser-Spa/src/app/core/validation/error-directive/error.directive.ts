import { Attribute, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: 'mc-error, [mcError]',
  standalone: true,
  host: {
    'class': 'text-red-600 text-xs px-2',
    '[id]': 'id',
  }
})
export class ErrorDirective {

  @Input()
  public id: string = 'mc-error'

  constructor(@Attribute('aria-live') ariaLive: string, elementRef: ElementRef) {
    if (!ariaLive) {
      elementRef.nativeElement.setAttribute('aria-live', 'polite');
    }
  }
}

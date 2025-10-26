import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core';
import { delay, of } from 'rxjs';

/**
 * Autofocus Directive
 *
 * Automatically focuses the element when it is rendered in the view.
 * Useful for forms and input fields that should have immediate focus.
 *
 * Usage:
 * <input appAutofocus />
 * <input [appAutofocus]="true" />
 * <input [appAutofocus]="shouldFocus" />
 */
@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);

  public readonly appAutofocus = input<boolean>(true);

  public ngAfterViewInit(): void {
    if (this.appAutofocus()) {
      of(null)
        .pipe(delay(0))
        .subscribe(() => {
          this.elementRef.nativeElement.focus();
        });
    }
  }
}

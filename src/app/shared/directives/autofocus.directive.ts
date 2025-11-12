import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
} from '@angular/core';

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
export class AutofocusDirective implements OnInit {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  public readonly appAutofocus = input<boolean>(true);

  public ngOnInit(): void {
    if (this.appAutofocus()) {
      afterNextRender(
        () => {
          this.elementRef.nativeElement.focus();
        },
        { injector: this.injector }
      );
    }
  }
}

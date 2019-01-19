import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements AfterContentInit {
  @Input() public appAutoFocus: boolean;

  public constructor(
    private readonly el: ElementRef,
    private readonly keyboard: Keyboard,
  ) {}

  public ngAfterContentInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
      this.keyboard.show();
    }, 500);
  }
}

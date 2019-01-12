import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appDynamicHeight]',
})
export class DynamicHeightDirective implements AfterViewInit {
  @HostBinding('rows') rows = 1;

  @Input() @HostBinding('style.min-height') minHeight: string;
  @Input() @HostBinding('style.max-height') maxHeight: string;

  constructor(private readonly element: ElementRef) {}

  public ngAfterViewInit() {
    this.resize();
  }

  @HostListener('ngModelChange')
  public resize() {
    const textarea = this.element.nativeElement as HTMLTextAreaElement;
    // Reset textarea height to auto that correctly calculate the new height
    textarea.style.height = 'auto';
    // Add extra height - 1px from top and 1px from bottom
    const textareaBorder = 2;
    textarea.style.height = `${textarea.scrollHeight + textareaBorder}px`;
  }
}

import {
  AfterContentInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appAutoScroll]',
})
export class AutoScrollDirective implements AfterContentInit, OnDestroy {
  @Input() lockYOffset = 10;
  @Input() observeAttributes = 'false';

  isLocked = false;

  private readonly nativeElement: HTMLElement;
  private mutationObserver: MutationObserver;

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  ngAfterContentInit() {
    this.mutationObserver = new MutationObserver(() => {
      if (!this.isLocked) {
        this.scrollDown();
      }
    });
    this.mutationObserver.observe(this.nativeElement, {
      childList: true,
      subtree: true,
      attributes: this.getObserveAttributes(),
    });
  }

  ngOnDestroy() {
    this.mutationObserver.disconnect();
  }

  @HostListener('scroll')
  scrollHandler() {
    const scrollFromBottom =
      this.nativeElement.scrollHeight -
      this.nativeElement.scrollTop -
      this.nativeElement.clientHeight;
    this.isLocked = scrollFromBottom > this.lockYOffset;
  }

  private scrollDown() {
    this.nativeElement.scrollTop = this.nativeElement.scrollHeight;
  }

  private getObserveAttributes(): boolean {
    return (
      this.observeAttributes !== '' &&
      this.observeAttributes.toLowerCase() !== 'false'
    );
  }
}

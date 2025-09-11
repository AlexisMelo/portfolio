import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Renderer2,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appStickyObserver]',
  standalone: true,
})
export class StickyObserverDirective implements AfterViewInit, OnDestroy {
  /**
   * Observer to detect when an element becomes sticky
   */
  private observer!: IntersectionObserver;

  /**
   * Element used to detect when an element becomes sticky
   */
  private sentinel!: HTMLElement;

  /**
   * Element with directive attached
   */
  private element = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Renderer to manipulate DOM
   */
  private renderer = inject(Renderer2);

  /**
   * AfterViewInit implementation
   */
  ngAfterViewInit() {
    const element = this.element.nativeElement;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        entry.target.classList.toggle(
          'is-sticking',
          entry.intersectionRatio < 1
        );
        console.log(entry);
      },
      { threshold: [1] }
    );

    this.observer.observe(element);
  }

  /**
   * OnDestroy implementation
   */
  ngOnDestroy() {
    this.observer.disconnect();
    this.sentinel.remove();
  }
}

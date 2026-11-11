import {
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';

/**
 * Grid of dots behind the whole app, to give the page background some texture.
 * It fades out around the mouse cursor.
 */
@Component({
  selector: 'app-background-grid',
  template: '',
  styleUrl: './background-grid.component.scss',
  host: { 'aria-hidden': 'true' },
})
export class BackgroundGridComponent implements OnDestroy {
  /**
   * Host element, which draws the grid
   */
  private host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /**
   * Document whose pointer moves are followed
   */
  private document = inject(DOCUMENT);

  /**
   * Pending animation frame that moves the faded area
   */
  private frame = 0;

  /**
   * Constructor: follows the mouse with native listeners, which do not run change detection
   */
  constructor() {
    this.document.addEventListener('pointermove', this.onPointerMove, {
      passive: true,
    });
    this.document.documentElement.addEventListener(
      'pointerleave',
      this.onPointerLeave
    );
  }

  /**
   * Removes the listeners
   */
  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.document.removeEventListener('pointermove', this.onPointerMove);
    this.document.documentElement.removeEventListener(
      'pointerleave',
      this.onPointerLeave
    );
  }

  /**
   * Moves the faded area under the cursor, once per frame at most. Touch and pen moves are ignored.
   * An arrow function, so that it keeps `this` and can be removed in ngOnDestroy
   */
  private onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') return;

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      this.host.style.setProperty('--cursor-x', `${event.clientX}px`);
      this.host.style.setProperty('--cursor-y', `${event.clientY}px`);
      this.host.classList.add('cursor-inside');
    });
  };

  /**
   * Shrinks the faded area when the mouse leaves the window
   */
  private onPointerLeave = (): void => {
    this.host.classList.remove('cursor-inside');
  };
}

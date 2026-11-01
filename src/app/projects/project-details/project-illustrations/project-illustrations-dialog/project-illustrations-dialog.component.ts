import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProjectIllustrationsDialogData } from './project-illustrations-dialog-data.model';

@Component({
  selector: 'app-project-illustrations-dialog',
  imports: [MatIconModule, TranslocoPipe],
  templateUrl: './project-illustrations-dialog.component.html',
  styleUrl: './project-illustrations-dialog.component.scss',
  host: {
    'animate.enter': 'dialog-enter',
    '[class.dialog-leave]': 'leaving()',
    '(animationend)': 'onAnimationEnd($event)',
  },
})
export class ProjectIllustrationsDialogComponent {
  /**
   * Whether the dialog is playing its leave animation, after which it closes
   */
  protected readonly leaving = signal(false);

  /**
   * Data with illustrations
   */
  public data: ProjectIllustrationsDialogData = inject(DIALOG_DATA);

  /**
   * Dialog reference
   */
  private dialogRef = inject<DialogRef>(DialogRef);

  /**
   * Access template
   */
  private elementRef = inject(ElementRef);

  /**
   * Index of the currently displayed slide
   */
  public currentSlide = this.data.slideShownOnOpen;

  /**
   * Shows the intended slide
   * @param index
   */
  public showSlide(index: number) {
    const totalSlides = this.data.illustrations.length;

    if (index >= totalSlides) {
      this.currentSlide = 0;
    } else if (index < 0) {
      this.currentSlide = totalSlides - 1;
    } else {
      this.currentSlide = index;
    }

    const carouselItems = this.elementRef.nativeElement.getElementsByClassName(
      'carousel-item-modal'
    );

    if (!carouselItems) return;

    for (const slide of carouselItems) {
      slide.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }

  /**
   * Displays the next slide
   * @param direction
   */
  public nextSlide(direction: number) {
    this.showSlide(this.currentSlide + direction);
  }

  /**
   * Closes dialog
   */
  public closeDialog() {
    this.leaving.set(true);

    const backdrop = document.querySelector('.custom-backdrop');
    if (backdrop) {
      backdrop.classList.add('cdk-overlay-backdrop-exit');
    }
  }

  /**
   * Closes the dialog once its leave animation is over.
   * The keyframes name is scoped by the component styles, hence the check on leaving() instead.
   * @param event animationend event, possibly from an animation inside the dialog
   */
  protected onAnimationEnd(event: AnimationEvent) {
    if (event.target === this.elementRef.nativeElement && this.leaving()) {
      this.dialogRef.close();
    }
  }
}

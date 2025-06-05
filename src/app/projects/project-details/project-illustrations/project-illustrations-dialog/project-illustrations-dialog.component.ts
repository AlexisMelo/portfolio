import {
  animate,
  style,
  transition,
  trigger,
  AnimationEvent,
  state,
} from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, HostBinding, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectIllustrationsDialogData } from './project-illustrations-dialog-data.model';

@Component({
  selector: 'app-project-illustrations-dialog',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './project-illustrations-dialog.component.html',
  styleUrl: './project-illustrations-dialog.component.scss',
  animations: [
    trigger('dialogAnim', [
      state(
        'enter',
        style({ opacity: 1, transform: 'scale(1) translateY(0)' })
      ),
      state(
        'leave',
        style({ opacity: 0, transform: 'scale(0.8) translateY(1000px)' })
      ),
      transition('void => enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(1000px)' }),
        animate('500ms cubic-bezier(0.165, 0.84, 0.44, 1)'),
      ]),
      transition('enter => leave', [
        animate('300ms cubic-bezier(0.165, 0.84, 0.44, 1)'),
      ]),
    ]),
  ],
  host: {
    '(@dialogAnim.done)': 'onAnimationDone($event)',
  },
})
export class ProjectIllustrationsDialogComponent {
  /**
   * Bind a class to the host
   */
  @HostBinding('@dialogAnim') anim = true;

  /**
   * State of the animation
   */
  @HostBinding('@dialogAnim') animationState: 'enter' | 'leave' = 'enter';

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
    this.animationState = 'leave';

    const backdrop = document.querySelector('.custom-backdrop');
    if (backdrop) {
      backdrop.classList.add('cdk-overlay-backdrop-exit');
    }
  }

  /**
   * Handle animation once its over
   */
  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'leave') {
      this.dialogRef.close();
    }
  }
}

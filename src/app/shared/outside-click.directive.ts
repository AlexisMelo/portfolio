import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appOutsideClick]',
  standalone: true,
})
export class OutsideClickDirective {
  /**
   * Référence à l'élément
   */
  private elementRef = inject(ElementRef);

  /**
   * Emet lorsqu'un click est effectué en dehors de l'élément
   */
  @Output() outsideClick: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Appellé lors d'un click sur l'élément
   * @param event
   */
  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.outsideClick.emit(event);
    }
  }
}

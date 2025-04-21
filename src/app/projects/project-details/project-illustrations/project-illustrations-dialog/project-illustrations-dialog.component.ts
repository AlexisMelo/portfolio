import { Component, ElementRef, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ProjectIllustrationsDialogData } from './project-illustrations-dialog-data.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-illustrations-dialog',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './project-illustrations-dialog.component.html',
  styleUrl: './project-illustrations-dialog.component.scss',
})
export class ProjectIllustrationsDialogComponent {
  /**
   * Données du modal d'illustrations de projet
   */
  public data: ProjectIllustrationsDialogData = inject(DIALOG_DATA);

  /**
   * Référence au dialog
   */
  private dialogRef = inject<DialogRef>(DialogRef);

  /**
   * Accès au template
   */
  private elementRef = inject(ElementRef);

  /**
   * Index de la slide affichée
   */
  public currentSlide = this.data.slideShownOnOpen;

  /**
   * Affiche la slide voulue
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
   * Passe au prochain slide
   * @param direction
   */
  public nextSlide(direction: number) {
    this.showSlide(this.currentSlide + direction);
  }

  /**
   * Ferme le dialog
   */
  public closeDialog() {
    this.dialogRef.close();
  }
}

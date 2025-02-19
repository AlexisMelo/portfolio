import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { ActionButtonComponent } from '../../../contact/action-button/action-button.component';
import { Project } from '../../project.model';
import { Tables } from 'database.types';
import { MatIconModule } from '@angular/material/icon';

/**
 * Tuto Carousel https://stackoverflow.com/a/78784511/13770966
 */
@Component({
  selector: 'app-project-illustrations',
  standalone: true,
  imports: [ActionButtonComponent, MatIconModule],
  templateUrl: './project-illustrations.component.html',
  styleUrl: './project-illustrations.component.scss',
})
export class ProjectIllustrationsComponent
  extends GridItemDirective
  implements AfterViewInit
{
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;

  /**
   * Index de la slide affichée
   */
  public currentSlide = 0;

  /**
   * Index de la slide affichée dans le modal
   */
  public currentSlideModal = 0;

  /**
   * Accès au template
   */
  private elementRef = inject(ElementRef);

  /**
   * Stockage pour l'interval de l'autoslide
   */
  private autoSlideInterval?: NodeJS.Timeout;

  /**
   * Référence à l'élément du modal
   */
  @ViewChild('modal') modal?: ElementRef<HTMLDivElement>;

  /**
   * Référence à l'élément du modal
   */
  @ViewChild('modalImg') modalImg?: ElementRef<HTMLImageElement>;

  /**
   * Caption associée à l'image
   */
  @ViewChild('caption') caption?: ElementRef<HTMLDivElement>;

  /**
   * Affiche la slide voulue
   * @param index
   */
  public showSlide(index: number) {
    const totalSlides = this.project.illustrations.length;

    if (index >= totalSlides) {
      this.currentSlide = 0;
    } else if (index < 0) {
      this.currentSlide = totalSlides - 1;
    } else {
      this.currentSlide = index;
    }

    const carouselItems =
      this.elementRef.nativeElement.getElementsByClassName('carousel-item');

    if (!carouselItems) return;

    for (const slide of carouselItems) {
      slide.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }

  /**
   * Affiche la slide voulue dans le modal
   * @param index
   */
  public showSlideModal(index: number) {
    const totalSlides = this.project.illustrations.length;

    if (index >= totalSlides) {
      this.currentSlideModal = 0;
    } else if (index < 0) {
      this.currentSlideModal = totalSlides - 1;
    } else {
      this.currentSlideModal = index;
    }

    this.showIllustrationModal(
      this.project.illustrations[this.currentSlideModal]
    );
  }

  /**
   * Passe au prochain slide
   * @param direction
   */
  public nextSlide(direction: number) {
    this.showSlide(this.currentSlide + direction);
    this.resetAutoSlide();
  }

  /**
   * Passe au prochain slide sur le modal
   * @param direction
   */
  public nextSlideModal(direction: number) {
    this.showSlideModal(this.currentSlideModal + direction);
  }

  /**
   * Implémentation de AfterViewInit
   */
  ngAfterViewInit() {
    this.startAutoSlide();
  }

  /**
   * Démarre le slide automatique
   */
  private startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(1);
    }, 4000);
  }

  /**
   * Recommence l'autoslide
   */
  private resetAutoSlide() {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  /**
   * Ouvre le modal avec l'image en zoom
   * @param illustration
   */
  public openModal(illustration?: Tables<'project_illustration'>) {
    if (!this.modal) return;

    this.modal.nativeElement.style.display = 'flex';

    this.currentSlideModal = this.currentSlide;

    this.showIllustrationModal(
      illustration ?? this.project.illustrations[this.currentSlide]
    );
  }

  /**
   * Affiche l'illustration voulue dans le modal
   * @param illustration
   * @returns
   */
  public showIllustrationModal(illustration: Tables<'project_illustration'>) {
    if (!this.modalImg || !this.caption) return;

    this.modalImg.nativeElement.src = illustration.url;
    this.modalImg.nativeElement.alt = illustration.alt;

    this.caption.nativeElement.innerText = illustration.alt;
  }

  /**
   * Ferme le modal
   */
  public closeModal() {
    if (!this.modal) return;

    this.modal.nativeElement.style.display = 'none';
  }
}

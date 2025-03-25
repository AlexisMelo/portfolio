import {
  Component,
  ElementRef,
  inject,
  Input,
  AfterViewInit,
} from '@angular/core';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { Project } from '../../project.model';
import { ActionButtonComponent } from '../../../contact/action-button/action-button.component';
import { CoworkerInfoComponent } from './coworker-info/coworker-info.component';

@Component({
  selector: 'app-project-coworkers',
  standalone: true,
  imports: [ActionButtonComponent, CoworkerInfoComponent],
  templateUrl: './project-coworkers.component.html',
  styleUrl: './project-coworkers.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectCoworkersComponent
  extends GridItemDirective
  implements AfterViewInit
{
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;

  /**
   * Accès au template
   */
  private elementRef = inject(ElementRef);

  /**
   * Index du coworker actuellement affiché
   */
  public currentSlide = 0;

  /**
   * Stockage pour l'interval de l'autoslide
   */
  private autoSlideInterval?: NodeJS.Timeout;

  /**
   * Affiche la slide voulue
   * @param index
   */
  public showSlide(index: number) {
    const totalSlides = this.project.coworkers.length;

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
   * Démarre le slide automatique
   */
  private startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(1);
    }, 4000);
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
   * Recommence l'autoslide
   */
  private resetAutoSlide() {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  /**
   * Implémentation de AfterViewInit
   */
  ngAfterViewInit() {
    this.startAutoSlide();
  }
}

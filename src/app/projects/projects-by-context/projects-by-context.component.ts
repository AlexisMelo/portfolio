import { Component, ElementRef, inject, AfterViewInit } from '@angular/core';
import { ContextWithProjects } from 'src/app/landing-page/timeline/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { ActionButtonComponent } from '../../contact/action-button/action-button.component';
import { MatIconModule } from '@angular/material/icon';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-projects-by-context',
  standalone: true,
  imports: [ActionButtonComponent, MatIconModule, SlicePipe],
  templateUrl: './projects-by-context.component.html',
  styleUrl: './projects-by-context.component.scss',
})
export class ProjectsByContextComponent
  extends GridItemDirective
  implements AfterViewInit
{
  /**
   * Gestion de la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Contextes
   */
  public nonEmptyContexts?: Array<ContextWithProjects>;

  /**
   * Index du contexte actuellement affiché
   */
  public currentSlide = 0;

  /**
   * Stockage pour l'interval de l'autoslide
   */
  private autoSlideInterval?: NodeJS.Timeout;

  /**
   * Accès au template
   */
  private elementRef = inject(ElementRef);

  /**
   * Constructeur
   */
  constructor() {
    super();
    this.supabaseService
      .getContexts()
      .then(
        contexts =>
          (this.nonEmptyContexts = contexts.filter(c => c.projects.length > 0))
      );
  }

  /**
   * Affiche la slide voulue
   * @param index
   */
  public showSlide(index: number) {
    if (!this.nonEmptyContexts) return;

    const totalSlides = this.nonEmptyContexts.length;

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

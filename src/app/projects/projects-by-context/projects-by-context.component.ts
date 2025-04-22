import { DatePipe, SlicePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Tables } from 'database.types';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { RangePipe } from 'src/app/shared/pipes/range.pipe';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { ActionButtonComponent } from '../../contact/action-button/action-button.component';
import { ContextWithProjects } from 'src/app/landing-page/timeline/context-with-projects.model';

@Component({
  selector: 'app-projects-by-context',
  standalone: true,
  imports: [
    ActionButtonComponent,
    MatIconModule,
    DatePipe,
    RangePipe,
    SlicePipe,
  ],
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
   * Gestion des routes
   */
  private router = inject(Router);

  /**
   * Constructeur
   */
  constructor() {
    super();
    this.supabaseService.getContexts().then(
      contexts =>
        (this.nonEmptyContexts = contexts
          .filter(c => c.projects.length > 0)
          .sort((c1, c2) => {
            if (!c1.end_date) return -1;
            if (!c2.end_date) return 1;
            return new Date(c1.end_date).getTime() >
              new Date(c2.end_date).getTime()
              ? -1
              : 1;
          }))
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

  /**
   * Voir plus de projets d'un contexte
   * @param context
   */
  seeMore(context: Tables<'context'>) {
    this.router.navigate([ARCHIVES_ROUTE], {
      queryParams: {
        contexts: context.id,
      },
    });
  }
}

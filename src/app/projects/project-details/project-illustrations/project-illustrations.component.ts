import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../../../contact/action-button/action-button.component';
import { Project } from '../../project.model';
import { ProjectIllustrationsDialogComponent } from './project-illustrations-dialog/project-illustrations-dialog.component';
import { Subscription } from 'rxjs';
import { Tables } from 'database.types';

/**
 * Tuto Carousel https://stackoverflow.com/a/78784511/13770966
 */
@Component({
  selector: 'app-project-illustrations',
  standalone: true,
  imports: [ActionButtonComponent, MatIconModule, DialogModule],
  templateUrl: './project-illustrations.component.html',
  styleUrl: './project-illustrations.component.scss',
})
export class ProjectIllustrationsComponent
  extends GridItemDirective
  implements AfterViewInit, OnDestroy, OnInit
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
   * Caption associée à l'image
   */
  @ViewChild('caption') caption?: ElementRef<HTMLDivElement>;

  /**
   * Gestion des boites de dialogue
   */
  private dialog = inject(Dialog);

  /**
   * Souscription à l'affichage des illustrations
   */
  private dialogIllustrationsSubscription?: Subscription;

  /**
   * Illustrations du projet triées
   */
  public illustrationsSorted?: Array<Tables<'project_illustration'>>;

  /**
   * Implémentation de OnDestroy
   */
  public ngOnDestroy(): void {
    this.stopAutoSlide();
    this.dialogIllustrationsSubscription?.unsubscribe();
  }

  /**
   * Affiche la slide voulue
   * @param index
   */
  public showSlide(index: number) {
    if (!this.illustrationsSorted) return;

    const totalSlides = this.illustrationsSorted.length;

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
   * Passe au prochain slide
   * @param direction
   */
  public nextSlide(direction: number) {
    this.showSlide(this.currentSlide + direction);
    this.resetAutoSlide();
  }

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.illustrationsSorted = this.project.illustrations.sort((i1, i2) =>
      i1.position > i2.position ? 1 : -1
    );
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
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  /**
   * Arrête le slide automatique
   */
  private stopAutoSlide() {
    clearInterval(this.autoSlideInterval);
  }

  /**
   * Ouvre le modal avec l'image en zoom
   * @param illustration
   */
  public openDialog() {
    this.stopAutoSlide();
    const dialogRef = this.dialog.open(ProjectIllustrationsDialogComponent, {
      data: {
        illustrations: this.illustrationsSorted,
        slideShownOnOpen: this.currentSlide,
      },
    });

    this.dialogIllustrationsSubscription = dialogRef.closed.subscribe(() =>
      this.resetAutoSlide()
    );
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Tables } from 'database.types';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { Skill } from 'src/app/projects/skill.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SkillGroup } from './skill-group.model';

@Component({
  selector: 'app-skills-recap',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './skills-recap.component.html',
  styleUrl: './skills-recap.component.scss',
})
export class SkillsRecapComponent
  extends GridItemDirective
  implements AfterViewInit
{
  /**
   * Toutes les compétences
   */
  private _skills?: Array<Skill>;

  /**
   * Compétences à afficher
   */
  @Input({ required: true }) set skills(value: Array<Skill>) {
    this._skills = value;
    this.updateGroupedSkills();
  }

  /**
   * Couleur de fond des skills
   */
  @Input({ required: true }) recapBackgroundColor!: string;

  /**
   * Couleur d'écriture des skills
   */
  @Input({ required: true }) recapColor!: string;

  /**
   * Route vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Technologies groupées par type
   */
  public groupedSkills: Array<SkillGroup> = [];

  /**
   * Accès au template
   */
  private elementRef = inject(ElementRef);

  /**
   * Index du slide actuellement affiché
   */
  public currentSlide = 0;

  /**
   * Stockage pour l'interval de l'autoslide
   */
  private autoSlideInterval?: NodeJS.Timeout;

  /**
   * Technologies groupées par type
   */
  private updateGroupedSkills() {
    if (!this._skills) return;

    const skillsGrouped = this._skills.reduce(
      (
        group: {
          [key: string]: { skill: Tables<'skill_type'>; skills: Skill[] };
        },
        item: Skill
      ) => {
        group[item.skill_type.id] = group[item.skill_type.id] || {
          skill: item.skill_type,
          skills: [],
        };
        group[item.skill_type.id].skills.push(item);
        return group;
      },
      {}
    );

    for (const [key, group] of Object.entries(skillsGrouped)) {
      skillsGrouped[key].skills = group.skills.sort((a, b) =>
        a.projects.length > b.projects.length ? -1 : 1
      );
    }

    this.groupedSkills = Object.values(skillsGrouped).sort((a, b) =>
      a.skill.position > b.skill.position ? 1 : -1
    );
  }

  /**
   * Affiche la slide voulue
   * @param index
   */
  private showSlide(index: number) {
    const totalSlides = Object.keys(this.groupedSkills).length;

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
   * Sélectionne le slide voulu
   * @param i
   */
  public selectSlide(i: number) {
    this.showSlide(i);
    this.resetAutoSlide();
  }

  /**
   * Implémentation de AfterViewInit
   */
  ngAfterViewInit() {
    this.startAutoSlide();
  }
}

import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Tables } from 'database.types';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { Skill } from 'src/app/skills/skill.model';

@Component({
  selector: 'app-skills-recap',
  standalone: true,
  imports: [RouterLink, MatIconModule, LoaderComponent],
  templateUrl: './skills-recap.component.html',
  styleUrl: './skills-recap.component.scss',
})
export class SkillsRecapComponent
  extends GridItemDirective
  implements AfterViewInit
{
  /**
   * Skills to display
   */
  public skills = input.required<Array<Skill>>();

  /**
   * Route vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Accès au template
   */
  private elementRef = inject(ElementRef);

  /**
   * Index du slide actuellement affiché
   */
  public currentSlide = signal(0);

  /**
   * Stockage pour l'interval de l'autoslide
   */
  private autoSlideInterval?: NodeJS.Timeout;

  /**
   * Skills grouped by type
   */
  protected groupedSkills = computed(() => {
    const skills = this.skills();

    if (!skills) return [];

    const skillsGrouped = skills.reduce(
      (
        group: {
          [key: string]: { skill_type: Tables<'skill_type'>; skills: Skill[] };
        },
        item: Skill
      ) => {
        group[item.skill_type.id] = group[item.skill_type.id] || {
          skill_type: item.skill_type,
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

    return Object.values(skillsGrouped).sort((a, b) =>
      a.skill_type.position > b.skill_type.position ? 1 : -1
    );
  });

  /**
   * Affiche la slide voulue
   * @param index
   */
  private showSlide(index: number) {
    const totalSlides = Object.keys(this.groupedSkills()).length;

    if (index >= totalSlides) {
      this.currentSlide.set(0);
    } else if (index < 0) {
      this.currentSlide.set(totalSlides - 1);
    } else {
      this.currentSlide.set(index);
    }

    const carouselItems =
      this.elementRef.nativeElement.getElementsByClassName('carousel-item');

    if (!carouselItems) return;

    for (const slide of carouselItems) {
      slide.style.transform = `translateX(-${this.currentSlide() * 100}%)`;
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
    this.showSlide(this.currentSlide() + direction);
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

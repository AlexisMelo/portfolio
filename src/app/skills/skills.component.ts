import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { KeyHeaderComponent } from '../projects/archives/key-header/key-header.component';
import { gridItemAnimation } from '../shared/animations';
import { RangePipe } from '../shared/pipes/range.pipe';
import { SupabaseService } from '../shared/supabase.service';
import { ThemeService } from '../shared/theme.service';
import { KeepLearningComponent } from './keep-learning/keep-learning.component';
import { LovedPipe } from './loved.pipe';
import { SkillHighlightComponent } from './skill-highlight/skill-highlight.component';
import { SkillSectionDescriptionComponent } from './skill-section-description/skill-section-description.component';
import { Skill } from './skill.model';
import { SkillsRecapComponent } from './skills-recap/skills-recap.component';
import { SkillsSection } from './skills-section.model';
import { FavoritesComponent } from './favorites/favorites.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    SkillSectionDescriptionComponent,
    NgClass,
    SkillsRecapComponent,
    LovedPipe,
    SkillHighlightComponent,
    RangePipe,
    KeyHeaderComponent,
    KeepLearningComponent,
    FavoritesComponent,
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  animations: [gridItemAnimation],
})
export class SkillsComponent implements OnInit {
  /**
   * Liste des sections à afficher
   */
  public sections: Array<SkillsSection> = [
    {
      id: 'front-end',
      heading: "Création d'interfaces",
      subtitle: 'Frontend',
      description:
        'Création de maquettes, intégration complexe et accessibilité ! Je crée des interfaces qui plaisent au plus grand nombre, au quotidien',
      skillFieldId: 1,
      skills: [],
      class: 'frontend-grid',
      recapBackgroundColor: 'var(--skills-recap-frontend-bg)',
      sectionBackgroundColor: 'var(--skill-section-header-frontend-bg)',
      sectionColor: 'var(--skill-section-header-frontend-color)',
    },
    {
      id: 'back-end',
      heading: 'Gestion de données',
      subtitle: 'Backend',
      description:
        "La donnée est le coeur de métier de la plupart des projets. J'apprécie les problématiques liées à sa collecte, persistance et mise à disposition",
      skillFieldId: 2,
      skills: [],
      class: 'backend-grid',
      recapBackgroundColor: 'var(--skills-recap-backend-bg)',
      sectionBackgroundColor: 'var(--skill-section-header-backend-bg)',
      sectionColor: 'var(--skill-section-header-backend-color)',
    },
    {
      id: 'general',
      heading: 'Et bien plus',
      subtitle: 'Général',
      description:
        "Le code, c'est super ! Mais pour être un développeur complet, je m'intéresse aussi la gestion de projet, le déploiement et l'intégration continue",
      skillFieldId: 3,
      skills: [],
      class: 'general-grid',
      recapBackgroundColor: 'var(--skills-recap-general-bg)',
      sectionBackgroundColor: 'var(--skill-section-header-general-bg)',
      sectionColor: 'var(--skill-section-header-general-color)',
    },
  ];

  /**
   * Accès à la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Liste des skills
   */
  public skills?: Array<Skill>;

  /**
   * Gestion du thème
   */
  public themeService = inject(ThemeService);

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService.getSkills().then(skills => {
      this.skills = skills;

      for (const section of this.sections) {
        section.skills = this.skills?.filter(
          s => s.skill_field.id === section.skillFieldId
        );
      }
    });
  }
}

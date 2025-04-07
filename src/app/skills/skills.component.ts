import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Skill } from '../projects/skill.model';
import { SupabaseService } from '../shared/supabase.service';
import { SkillSectionDescriptionComponent } from './skill-section-description/skill-section-description.component';
import { SkillSectionHeaderComponent } from './skill-section-header/skill-section-header.component';
import { SkillsSection } from './skills-section.model';
import { SkillsRecapComponent } from './skills-recap/skills-recap.component';
import { LovedPipe } from './loved.pipe';
import { SkillHighlightComponent } from './skill-highlight/skill-highlight.component';
import { LearningPipe } from './learning.pipe';
import { ThemeService } from '../shared/theme.service';
import { RangePipe } from '../shared/pipes/range.pipe';
import { SkillHighlightPlaceholderComponent } from './skill-highlight/skill-highlight-placeholder/skill-highlight-placeholder.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    SkillSectionHeaderComponent,
    SkillSectionDescriptionComponent,
    NgClass,
    SkillsRecapComponent,
    LovedPipe,
    SkillHighlightComponent,
    LearningPipe,
    RangePipe,
    SkillHighlightPlaceholderComponent,
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
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
        'Création de maquettes, implémentations complexes et accessibilité ! Je crée des interfaces qui plaisent au plus grand nombre, au quotidien',
      skillFieldId: 1,
      skills: [],
      class: 'frontend-grid',
      recapBackgroundColor: 'var(--skill-recap-frontend-bg)',
      recapColor: 'var(--skill-recap-frontend-color)',
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
      recapBackgroundColor: 'var(--skill-recap-backend-bg)',
      recapColor: 'var(--skill-recap-backend-color)',
      sectionBackgroundColor: 'var(--skill-section-header-backend-bg)',
      sectionColor: 'var(--skill-section-header-backend-color)',
    },
    {
      id: 'general',
      heading: 'Et bien plus',
      subtitle: 'Général',
      description:
        "Le code, c'est super ! Mais pour être un développeur complet, je m'intéresse également à d'autres sujets comme la gestion de projet, le déploiement et l'intégration continue",
      skillFieldId: 3,
      skills: [],
      class: 'general-grid',
      recapBackgroundColor: 'var(--skill-recap-general-bg)',
      recapColor: 'var(--skill-recap-general-color)',
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

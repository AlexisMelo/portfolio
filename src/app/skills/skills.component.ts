import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Skill } from '../projects/skill.model';
import { SupabaseService } from '../shared/supabase.service';
import { SkillSectionDescriptionComponent } from './skill-section-description/skill-section-description.component';
import { SkillSectionHeaderComponent } from './skill-section-header/skill-section-header.component';
import { SkillsSection } from './skills-section.model';
import { SkillsRecapComponent } from './skills-recap/skills-recap.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    SkillSectionHeaderComponent,
    SkillSectionDescriptionComponent,
    NgClass,
    SkillsRecapComponent,
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
        'Création de maquettes, implémentations complexes et accessibilité ! Je crée des interfaces qui plaisent au plus grand nombre, au quotidien.',
      skillFieldId: 1,
      skills: [],
      class: 'frontend-grid',
      bgColor: 'var(--skill-recap-frontend-bg)',
      color: 'var(--skill-recap-frontend-color)',
    },
    {
      id: 'back-end',
      heading: 'Gestion de données',
      subtitle: 'Backend',
      description:
        "La donnée est le coeur de métier de la plupart des projets. J'apprécie les problématiques liées à sa collecte, persistance et mise à disposition.",
      skillFieldId: 2,
      skills: [],
      class: 'backend-grid',
      bgColor: 'var(--skill-recap-backend-bg)',
      color: 'var(--skill-recap-backend-color)',
    },
    {
      id: 'general',
      heading: 'Et bien plus',
      subtitle: 'Général',
      description:
        "Le code, c'est bien ! Mais pour être un développeur complet, je m'intéresse également à d'autres sujets : gestion de projet, CI/CD, et bien plus...",
      skillFieldId: 3,
      skills: [],
      class: 'general-grid',
      bgColor: 'var(--skill-recap-general-bg)',
      color: 'var(--skill-recap-general-color)',
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

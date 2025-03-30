import { Component, inject, OnInit } from '@angular/core';
import { TitleSeparatorComponent } from '../shared/title-separator/title-separator.component';
import { RowWithSeparatorComponent } from '../shared/row-with-separator/row-with-separator.component';
import { SupabaseService } from '../shared/supabase.service';
import { Skill } from '../projects/skill.model';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillsSection } from './skills-section.model';
import { SkillSectionHeaderComponent } from './skill-section-header/skill-section-header.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    TitleSeparatorComponent,
    RowWithSeparatorComponent,
    SkillListComponent,
    SkillSectionHeaderComponent,
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
      subtitle: 'Front-end',
      description:
        "J'aime concevoir et développer des interfaces ésthétiques et intuitives afin qu'elles soient utilisées par le plus grand nombre !",
      skillFieldId: 1,
      items: [],
    },
    {
      id: 'back-end',
      heading: 'Gestion de données',
      subtitle: 'Back-end',
      description:
        "La donnée est le coeur de métier de la plupart des projets. J'apprécie les problématiques liées à sa collecte, persistance et mise à disposition.",
      skillFieldId: 2,
      items: [],
    },
    {
      id: 'general',
      heading: 'Compétences transversales',
      subtitle: 'Général',
      description:
        "Le code, c'est bien ! Mais pour être un développeur fullstack complet, je m'intéresse également à d'autres outils de gestion de projet et CI/CD.",
      skillFieldId: 3,
      items: [],
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
        section.items = this.skills?.filter(
          s => s.skill_field.id === section.skillFieldId
        );
      }
    });
  }
}

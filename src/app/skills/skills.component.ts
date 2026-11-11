import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { AllComponent } from '../projects/all/all.component';
import { KeyHeaderComponent } from '../projects/key-header/key-header.component';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { RangePipe } from '../shared/pipes/range.pipe';
import { SupabaseService } from '../shared/supabase.service';
import { ThemeService } from '../shared/theme.service';
import { FavoritesComponent } from './favorites/favorites.component';
import { KeepLearningComponent } from './keep-learning/keep-learning.component';
import { LovedPipe } from './loved.pipe';
import { SkillHighlightComponent } from './skill-highlight/skill-highlight.component';
import { SkillSectionDescriptionComponent } from './skill-section-description/skill-section-description.component';
import { SkillsRecapComponent } from './skills-recap/skills-recap.component';
import { SkillsSection } from './skills-section.model';

@Component({
  selector: 'app-skills',
  imports: [
    SkillSectionDescriptionComponent,
    SkillsRecapComponent,
    LovedPipe,
    SkillHighlightComponent,
    RangePipe,
    KeyHeaderComponent,
    KeepLearningComponent,
    FavoritesComponent,
    AllComponent,
    TranslocoPipe,
    GridEntranceDirective,
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  /**
   * Liste des sections à afficher
   */
  protected readonly sections = signal<Array<SkillsSection>>([
    {
      id: 'section-frontend',
      heading: 'skills.sections.frontend.heading',
      subtitle: 'skills.sections.frontend.subtitle',
      description: 'skills.sections.frontend.description',
      skillFieldId: 1,
      skills: [],
      class: 'frontend-grid',
    },
    {
      id: 'section-backend',
      heading: 'skills.sections.backend.heading',
      subtitle: 'skills.sections.backend.subtitle',
      description: 'skills.sections.backend.description',
      skillFieldId: 2,
      skills: [],
      class: 'backend-grid',
    },
    {
      id: 'section-general',
      heading: 'skills.sections.general.heading',
      subtitle: 'skills.sections.general.subtitle',
      description: 'skills.sections.general.description',
      skillFieldId: 3,
      skills: [],
      class: 'general-grid',
    },
  ]);

  /**
   * Accès à la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Gestion du thème
   */
  public themeService = inject(ThemeService);

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService.getSkills().then(skills => {
      this.sections.update(sections =>
        sections.map(section => ({
          ...section,
          skills: skills.filter(s => s.skill_field.id === section.skillFieldId),
        }))
      );
    });
  }
}

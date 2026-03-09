import { NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { Skill } from 'src/app/skills/skill.model';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-skill-highlight',
  imports: [MatIconModule, NgClass, LoaderComponent, TranslocoPipe],
  templateUrl: './skill-highlight.component.html',
  styleUrl: './skill-highlight.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class SkillHighlightComponent extends GridItemDirective {
  /** Skill to display. */
  public skill = input.required<Skill>();

  /** Should the component be displayed as loading. */
  public loading = input.required<boolean>();

  /** Language service. */
  private languageService = inject(LanguageService);

  /** Handle routes */
  private router = inject(Router);

  /** Localized description in the currently active language. */
  public description = computed(
    () => this.skill().localizedDescription[this.languageService.currentLang()]
  );

  /**
   * Redirection vers les projets en cas de click
   */
  @HostListener('click')
  onClick() {
    this.router.navigate([ARCHIVES_ROUTE], {
      queryParams: {
        skills: [this.skill().id],
      },
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-participation',
  imports: [TranslocoPipe],
  templateUrl: './project-participation.component.html',
  styleUrl: './project-participation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectParticipationComponent extends GridItemDirective {
  /** Project to display */
  public readonly project = input.required<Project>();

  /** Language service */
  private languageService = inject(LanguageService);

  /** Participation text in the currently active language. */
  protected localizedParticipation = computed(
    () =>
      this.project().localizedParticipation?.[this.languageService.currentLang()]
  );
}

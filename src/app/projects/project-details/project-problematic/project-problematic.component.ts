import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Project } from '../../project.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';

@Component({
  selector: 'app-project-problematic',
  imports: [TranslocoPipe],
  templateUrl: './project-problematic.component.html',
  styleUrl: './project-problematic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectProblematicComponent extends GridItemDirective {
  /** Project to display */
  public readonly project = input.required<Project>();

  /** Language service */
  private languageService = inject(LanguageService);

  /** Problematic text in the currently active language. */
  protected localizedProblem = computed(
    () => this.project().localizedProblem?.[this.languageService.currentLang()]
  );
}

import {
  Component,
  effect,
  EffectRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, first, Subscription } from 'rxjs';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SelectableItem } from 'src/app/shared/is-selected/selectable-item.model';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Skill } from 'src/app/skills/skill.model';
import { ArchivesService } from '../archives.service';

@Component({
  selector: 'app-project-filtering',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './project-filtering.component.html',
  styleUrl: './project-filtering.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectFilteringComponent
  extends GridItemDirective
  implements OnInit, OnDestroy
{
  /**
   * Handle data related to archives
   */
  public archivesService = inject(ArchivesService);

  /**
   * Handle connection to the database
   */
  public supabaseService = inject(SupabaseService);

  /**
   * List of all skills
   */
  public allSkills: WritableSignal<Array<Skill> | null> = signal(null);

  /**
   * List of all contexts
   */
  public allContexts: WritableSignal<Array<ContextWithProjects> | null> =
    signal(null);

  /**
   * FormControl pour la recherche par mots clés
   */
  public filterFormControl = new FormControl('');

  /**
   * Souscription aux changements de texte
   */
  private filterSubscription?: Subscription;

  /**
   * Get current route information
   */
  private route = inject(ActivatedRoute);

  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Handle contexts selection and route update
   */
  private contextsEffect?: EffectRef;

  /**
   * Constructor
   */
  constructor() {
    super();
    //Handle value reset/change from other components
    //Pas ouf ??
    effect(() => {
      this.filterFormControl.setValue(this.archivesService.filter());
    });
  }

  /**
   * Implementation of OnInit
   */
  public ngOnInit() {
    this.filterSubscription = this.filterFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: value => {
          this.archivesService.filter.set(value);
        },
      });

    this.supabaseService.getSkills().then(skills => {
      this.allSkills.set(skills);

      this.route.queryParamMap.pipe(first()).subscribe(params => {
        const selectedSkillsIds = params.get('skills');

        if (!selectedSkillsIds) return;

        const selectedSkillsIdsArray = selectedSkillsIds
          .split(',')
          .map(c => Number(c));

        this.archivesService.selectedSkills.set(
          skills.filter(s => selectedSkillsIdsArray.includes(s.id))
        );
      });
    });

    this.supabaseService.getContexts().then(contexts => {
      this.allContexts.set(contexts);

      this.route.queryParamMap.pipe(first()).subscribe(params => {
        const selectedContextsIds = params.get('contexts');

        if (!selectedContextsIds) return;

        const selectedContextsIdsArray = selectedContextsIds
          .split(',')
          .map(c => Number(c));

        this.archivesService.selectedContexts.set(
          contexts.filter(c => selectedContextsIdsArray.includes(c.id))
        );
      });
    });
  }

  /**
   * OnDestroy implenetation
   */
  ngOnDestroy() {
    this.filterSubscription?.unsubscribe();
    this.contextsEffect?.destroy();
  }

  /**
   * Selects a context
   */
  public selectContext(option: SelectableItem | null) {
    let selectedContext = null;

    if (option && option.id !== -1) {
      selectedContext = [option as ContextWithProjects];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        contexts:
          selectedContext === null
            ? undefined
            : selectedContext.map(c => c.id).join(','),
      },
      queryParamsHandling: 'merge',
    });

    this.archivesService.selectedContexts.set(selectedContext);
  }

  /**
   * Selects a skill
   */
  public selectSkill(option: SelectableItem | null) {
    let selectedSkill = null;

    if (option && option.id !== -1) {
      selectedSkill = [option as Skill];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        skills:
          selectedSkill === null
            ? undefined
            : selectedSkill.map(c => c.id).join(','),
      },
      queryParamsHandling: 'merge',
    });

    this.archivesService.selectedSkills.set(selectedSkill);
  }
}

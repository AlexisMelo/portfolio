import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ContextWithProjects } from 'src/app/landing-page/timeline/context-with-projects.model';
import { FilterChipComponent } from 'src/app/shared/chips/filter-chip/filter-chip.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SelectableItem } from 'src/app/shared/is-selected/selectable-item.model';
import { Skill } from 'src/app/skills/skill.model';

@Component({
  selector: 'app-project-filtering',
  standalone: true,
  imports: [FilterChipComponent, ReactiveFormsModule],
  templateUrl: './project-filtering.component.html',
  styleUrl: './project-filtering.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectFilteringComponent
  extends GridItemDirective
  implements OnInit, OnDestroy
{
  /**
   * Liste des contextes
   */
  public contexts: Array<ContextWithProjects> = [];

  /**
   * Contextes sélectionnés
   */
  public selectedContexts: Array<ContextWithProjects> = [];

  /**
   * Liste des skills
   */
  public skills: Array<Skill> = [];

  /**
   * Skills sélectionnés
   */
  public selectedSkills: Array<Skill> = [];

  /**
   * Gestion de la route actuelle
   */
  private route = inject(ActivatedRoute);

  /**
   * Gestion du routeur
   */
  private router = inject(Router);

  /**
   * FormControl pour la recherche par mots clés
   */
  public filterFormControl = new FormControl('');

  /**
   * Souscription aux changements de texte
   */
  private filterSubscription?: Subscription;

  /**
   * Filtre pour retrouver un projet
   */
  private filter: string | null = null;

  /**
   * Implementation of OnInit
   */
  public ngOnInit() {
    this.filterSubscription = this.filterFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: value => {
          this.filter = value;
        },
      });
  }

  /**
   * Implémentation de OnDestroy
   */
  ngOnDestroy() {
    this.filterSubscription?.unsubscribe();
  }

  /**
   * Met à jour la liste des contextes sélectionnés
   * @param contexts
   */
  private updateSelectedContexts(contexts: Array<ContextWithProjects>) {
    this.selectedContexts = contexts;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        contexts:
          this.selectedContexts.length === this.contexts.length ||
          this.selectedContexts.length === 0
            ? undefined
            : this.selectedContexts.map(c => c.id).join(','),
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Met à jour la liste des skills sélectionnés
   * @param skills
   */
  private updateSelectedSkills(skills: Array<Skill>) {
    this.selectedSkills = skills;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        skills:
          this.selectedSkills.length === this.skills.length ||
          this.selectedSkills.length === 0
            ? undefined
            : this.selectedSkills.map(s => s.id).join(','),
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Sélectionne tous les contextes
   */
  private selectAllContexts() {
    this.updateSelectedContexts([...this.contexts]);
  }

  /**
   * Sélectionne tous les skills
   */
  private selectAllSkills() {
    this.updateSelectedSkills([...this.skills]);
  }

  /**
   * Sélectionne un contexte particulier
   * @param option
   */
  public selectContext(option: SelectableItem) {
    if (option.id === -1) {
      this.selectAllContexts();
      return;
    }
    this.updateSelectedContexts([option as ContextWithProjects]);
  }

  /**
   * Sélectionne un skill particulier
   * @param option
   * @returns
   */
  public selectSkill(option: SelectableItem) {
    if (option.id === -1) {
      this.selectAllSkills();
      return;
    }
    this.updateSelectedSkills([option as Skill]);
  }
}

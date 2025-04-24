import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, first, Subscription } from 'rxjs';
import { ContextWithProjects } from 'src/app/landing-page/timeline/context-with-projects.model';
import { FilterChipComponent } from 'src/app/shared/chips/filter-chip/filter-chip.component';
import { InputComponent } from 'src/app/shared/input/input.component';
import { IsSelectedPipe } from 'src/app/shared/is-selected/is-selected.pipe';
import { SelectableItem } from 'src/app/shared/is-selected/selectable-item.model';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Skill } from '../../skills/skill.model';
import { Project } from '../project.model';
import { SelectableStatus } from '../status/selectable-status.model';
import {
  getStatusIdByKey,
  getStatusKeyByValue,
  getStatusValueByKey,
  Status,
  statusesKeys,
} from '../status/status.model';
import { StatusPipe } from '../status/status.pipe';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule, FilterChipComponent],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [IsSelectedPipe, StatusPipe],
})
export class ArchivesComponent implements OnInit, OnDestroy {
  /**
   * Liste des projets réalisés
   */
  private projects: Array<Project> = [];

  /**
   * Projets à afficher
   */
  get selectedProjects() {
    return this.projects.filter(
      p =>
        this.isSelectedPipe.transform(
          this.selectedContexts,
          p.project_context
        ) &&
        ((p.skills.length === 0 &&
          this.selectedSkills.length === this.skills.length) ||
          this.selectedSkills.some(s =>
            this.isSelectedPipe.transform(p.skills, s)
          )) &&
        this.selectedStatuses
          .map(s => s.label)
          .includes(getStatusValueByKey(this.statusPipe.transform(p))) &&
        (!this.filter || (this.filter && this.projectMatchesFilter(p)))
    );
  }

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
   * Liste des status existant
   */
  public statuses: Array<SelectableStatus> = [];

  /**
   * Status sélectionnés
   */
  public selectedStatuses: Array<SelectableStatus> = [];

  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Est-ce qu'un élément est sélectionné
   */
  private isSelectedPipe = inject(IsSelectedPipe);

  /**
   * Obtient le statut d'un projet
   */
  private statusPipe = inject(StatusPipe);

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
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getProjects()
      .then(projects => (this.projects = projects));

    const allStatuses: Array<SelectableStatus> = statusesKeys.map(key => ({
      id: getStatusIdByKey(key),
      label: getStatusValueByKey(key),
    }));

    this.statuses = allStatuses;
    this.selectedStatuses = allStatuses;

    this.route.queryParamMap.pipe(first()).subscribe(params => {
      const statuses = params.get('status');
      if (!statuses) return;
      const preselectedStatuses = statuses.split(',').map(s => s as Status);
      this.updateSelectedStatuses(
        this.statuses.filter(s =>
          preselectedStatuses.includes(getStatusKeyByValue(s.label))
        )
      );
    });

    this.supabaseService.getContexts().then(contexts => {
      this.contexts = contexts;
      this.selectedContexts = [...this.contexts];
      this.route.queryParamMap.pipe(first()).subscribe(params => {
        const contexts = params.get('contexts');
        if (!contexts) return;
        const preselectedContexts = contexts.split(',').map(c => Number(c));
        this.updateSelectedContexts(
          this.contexts.filter(c => preselectedContexts.includes(c.id))
        );
      });
    });

    this.supabaseService.getSkills().then(skills => {
      this.skills = skills;
      this.selectedSkills = [...this.skills];
      this.route.queryParamMap.pipe(first()).subscribe(params => {
        const skills = params.get('skills');
        if (!skills) return;
        const preselectedSkills = skills.split(',').map(s => Number(s));
        this.updateSelectedSkills(
          this.skills.filter(s => preselectedSkills.includes(s.id))
        );
      });
    });

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
   * Active/Désactive un contexte
   * @param context
   * @returns
   */
  toggleContext(context: ContextWithProjects) {
    //Si tous les contextes sont sélectionnés, on veut filtrer sur celui cliqué uniquement
    if (this.selectedContexts.length === this.contexts.length) {
      this.updateSelectedContexts([context]);
      return;
    }

    //Si il est déjà sélectionné, on le déselectionne
    if (this.isSelectedPipe.transform(this.selectedContexts, context)) {
      this.updateSelectedContexts(
        this.selectedContexts.filter(i => i.id !== context.id)
      );
      return;
    }

    //Si non sélectionné, sélection
    this.updateSelectedContexts([...this.selectedContexts, context]);
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
   * Met à jour la liste des statut sélectionnés
   * @param status
   */
  private updateSelectedStatuses(status: Array<SelectableStatus>) {
    this.selectedStatuses = status;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status:
          this.selectedStatuses.length === this.statuses.length ||
          this.selectedStatuses.length === 0
            ? undefined
            : this.selectedStatuses
                .map(s => getStatusKeyByValue(s.label))
                .join(','),
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Sélectionne tous les contextes
   */
  selectAllContexts() {
    this.updateSelectedContexts([...this.contexts]);
  }

  /**
   * Sélectionne tous les skills
   */
  selectAllSkills() {
    this.updateSelectedSkills([...this.skills]);
  }

  /**
   * Sélectionne tous les statuts
   */
  selectAllStatus() {
    this.updateSelectedStatuses([...this.statuses]);
  }

  /**
   * Est-ce que le projet match le filtre textuel
   * @param project
   */
  private projectMatchesFilter(project: Project): boolean {
    const filter = this.filter?.toLowerCase();
    if (!filter) return true; //si y'a pas de filtre

    if (project.label.toLowerCase().includes(filter)) return true; //nom
    if (project.project_type.label.toLowerCase().includes(filter)) return true;
    if (project.project_context.label.toLowerCase().includes(filter))
      return true;
    if (project.description?.toLowerCase().includes(filter)) return true;
    if (
      project.skills
        .map(s => s.label.toLowerCase())
        .find(s => s.includes(filter)) !== undefined
    )
      return true;

    return false;
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

  /**
   * Sélectionne un statut en particulier
   * @param option
   */
  public selectStatus(option: SelectableItem) {
    if (option.id === -1) {
      this.selectAllStatus();
      return;
    }
    this.updateSelectedStatuses([option as SelectableStatus]);
  }
}

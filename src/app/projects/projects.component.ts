import { Component, inject, OnInit } from '@angular/core';
import { Project } from './project.model';
import { SupabaseService } from '../shared/supabase.service';
import { Context } from '../landing-page/timeline/context.model';
import { Skill } from './skill.model';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ContextItemComponent } from './context-item/context-item.component';
import { IsSelectedPipe } from './is-selected.pipe';
import { first } from 'rxjs';

//animation : https://sergeygultyayev.medium.com/animations-in-angular-756e1d59e385
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectItemComponent,
    RouterLink,
    ContextItemComponent,
    ContextItemComponent,
    IsSelectedPipe,
  ],
  providers: [IsSelectedPipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  animations: [
    trigger('projectList', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({
              opacity: 0,
            }),
            stagger(100, [
              animate(
                '200ms',
                style({
                  opacity: 1,
                })
              ),
            ]),
          ],
          {
            optional: true,
          }
        ),
      ]),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {
  /**
   * Liste des projets réalisés
   */
  private projects: Array<Project> = [];

  /**
   * Liste des contextes
   */
  public contexts: Array<Context> = [];

  /**
   * Contextes sélectionnés
   */
  public selectedContexts: Array<Context> = [];

  /**
   * Liste des skills
   */
  public skills: Array<Skill> = [];

  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Est-ce qu'un élément est sélectionné
   */
  private isSelectedPipe = inject(IsSelectedPipe);

  /**
   * Gestion de la route actuelle
   */
  private route = inject(ActivatedRoute);

  /**
   * Gestion du routeur
   */
  private router = inject(Router);

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getProjects()
      .then(projects => (this.projects = projects));

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

    this.supabaseService.getSkills().then(skills => (this.skills = skills));
  }

  /**
   * Active/Désactive un contexte
   * @param context
   * @returns
   */
  toggleContext(context: Context) {
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
  private updateSelectedContexts(contexts: Array<Context>) {
    this.selectedContexts = contexts;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        contexts:
          this.selectedContexts.length === this.contexts.length
            ? undefined
            : this.selectedContexts.map(c => c.id).join(','),
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Sélectionne
   */
  selectAll() {
    this.updateSelectedContexts([...this.contexts]);
  }

  /**
   * Projets à afficher
   */
  get selectedProjects() {
    return this.projects.filter(p =>
      this.isSelectedPipe.transform(this.selectedContexts, p.context)
    );
  }
}

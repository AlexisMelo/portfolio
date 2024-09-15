import { Component, OnInit } from '@angular/core';
import { Project } from './project.model';
import { SupabaseService } from '../shared/supabase.service';
import { Context } from '../landing-page/timeline/context.model';
import { Skill } from './skill.model';
import { ProjectItemComponent } from './project-item/project-item.component';
import { RouterLink } from '@angular/router';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

//animation : https://sergeygultyayev.medium.com/animations-in-angular-756e1d59e385
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectItemComponent, RouterLink],
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
    trigger('projectItem', [
      transition(':enter', [style({ backgroundColor: 'red' })]),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {
  /**
   * Liste des projets réalisés
   */
  public projects: Array<Project> = [];

  /**
   * Liste des contextes
   */
  public contexts: Array<Context> = [];

  /**
   * Liste des skills
   */
  public skills: Array<Skill> = [];

  /**
   * Constructeur
   * @param supabaseService
   */
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getProjects()
      .then(projects => (this.projects = projects));
    this.supabaseService
      .getContexts()
      .then(contexts => (this.contexts = contexts));
    this.supabaseService.getSkills().then(skills => (this.skills = skills));
  }
}

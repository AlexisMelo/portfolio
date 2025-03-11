import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../shared/supabase.service';
import { TitleSeparatorComponent } from '../shared/title-separator/title-separator.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { Project } from './project.model';

//animation : https://sergeygultyayev.medium.com/animations-in-angular-756e1d59e385
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectItemComponent,
    ReactiveFormsModule,
    FormsModule,
    TitleSeparatorComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  /**
   * Liste des projets réalisés
   */
  private projects: Array<Project> = [];

  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Projets épinglés
   */
  get pinnedProjects() {
    return this.projects.filter(p => p.pinned);
  }

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getProjects()
      .then(projects => (this.projects = projects));
  }
}

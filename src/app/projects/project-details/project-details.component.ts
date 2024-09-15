import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../project.model';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  /**
   * Route
   */
  private route = inject(ActivatedRoute);

  /**
   * Service pour accéder à la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Service pour gérer les chargements
   */
  private loadingService = inject(LoadingService);

  /**
   * URL unique identifiant le projet
   */
  public projectUniqueUrl?: string;

  /**
   * Projet à afficher
   */
  public project?: Project;

  /**
   * Constructeur
   */
  constructor() {
    this.loadingService.projectDetails = this.projectUniqueUrl =
      this.route.snapshot.params['url'];
    if (!this.projectUniqueUrl) return;
    this.supabaseService
      .getProjectByUrl(this.projectUniqueUrl)
      .then(project => {
        if (project !== null) {
          this.project = project;
        }
      })
      .catch(err => console.log(err));
  }
}

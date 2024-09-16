import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../project.model';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [DatePipe, MatIcon],
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

  /**
   * Prend deux dates et retourne la différence dans un format lisible
   * @returns
   */
  get duration(): string {
    if (!this.project) return '-';

    const endDate = new Date(this.project.start_date);
    const startDate = this.project.end_date
      ? new Date(this.project.end_date)
      : new Date();

    // Calcul des années
    let years = startDate.getFullYear() - endDate.getFullYear();
    // Calcul des mois
    let months = startDate.getMonth() - endDate.getMonth();

    // Ajustement si le mois de date2 est avant celui de date1
    if (months < 0) {
      years--;
      months += 12;
    }

    // Construction des parties de la chaîne
    const yearText = years > 0 ? (years === 1 ? '1 an' : `${years} ans`) : '';
    const monthText =
      months > 0 ? (months === 1 ? '1 mois' : `${months} mois`) : '';

    // Combiner les résultats
    if (yearText && monthText) {
      return `${yearText} et ${monthText}`;
    } else if (yearText) {
      return yearText;
    } else if (monthText) {
      return monthText;
    } else {
      return 'En cours'; // Si aucune différence notable
    }
  }
}

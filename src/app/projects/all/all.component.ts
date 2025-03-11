import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { ActionButtonComponent } from 'src/app/contact/action-button/action-button.component';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [ActionButtonComponent, RouterLink],
  templateUrl: './all.component.html',
  styleUrl: './all.component.scss',
  host: { class: 'g-start-aligned' },
})
export class AllComponent extends GridItemDirective implements OnInit {
  /**
   * Chemin vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Tous les projets
   */
  public projects?: Array<Project>;

  /**
   * Gestion de la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService.getProjects().then(p => (this.projects = p));
  }
}

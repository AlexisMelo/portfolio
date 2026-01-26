import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Project } from '../project.model';
import { MosaiqueWebsitesComponent } from '../mosaique-websites/mosaique-websites.component';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [RouterLink, MatIconModule, MosaiqueWebsitesComponent],
  templateUrl: './all.component.html',
  styleUrl: './all.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
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
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService.getProjects().then(p => (this.projects = p));
  }

  /**
   * Handle clicking on the component
   */
  @HostListener('click') onClick() {
    this.router.navigate([ARCHIVES_ROUTE]);
  }
}

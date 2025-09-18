import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-ongoing',
  standalone: true,
  imports: [],
  templateUrl: './ongoing.component.html',
  styleUrl: './ongoing.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class OngoingComponent extends GridItemDirective implements OnInit {
  /**
   * Nombre de projets en cours
   */
  public count = 0;

  /**
   * Gestion de la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * OnInit implementation
   */
  ngOnInit() {
    this.supabaseService.countOngoingProjects().then(c => (this.count = c));
  }

  /**
   * Handle clicking on component
   */
  @HostListener('click') onClick() {
    this.router.navigate([PROJECTS_ROUTE], {
      queryParams: { status: 'ongoing' },
    });
  }
}

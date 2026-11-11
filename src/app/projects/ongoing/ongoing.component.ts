import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ARCHIVES_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-ongoing',
  imports: [TranslocoPipe],
  templateUrl: './ongoing.component.html',
  styleUrl: './ongoing.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-highlight' },
})
export class OngoingComponent extends GridItemDirective implements OnInit {
  /**
   * Nombre de projets en cours
   */
  protected readonly count = signal(0);

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
    this.supabaseService.countOngoingProjects().then(c => this.count.set(c));
  }

  /**
   * Handle clicking on component
   */
  @HostListener('click') onClick() {
    this.router.navigate([ARCHIVES_ROUTE], {
      queryParams: { status: 'ongoing' },
    });
  }
}

import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ARCHIVES_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { MosaiqueWebsitesComponent } from '../mosaique-websites/mosaique-websites.component';

@Component({
  selector: 'app-all',
  imports: [
    RouterLink,
    MatIconModule,
    MosaiqueWebsitesComponent,
    TranslocoPipe,
  ],
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
   * Number of projects, undefined until it is loaded
   */
  protected count = signal<number | undefined>(undefined);

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
    this.supabaseService.countProjects().then(c => this.count.set(c));
  }

  /**
   * Handle clicking on the component
   */
  @HostListener('click') onClick() {
    this.router.navigate([ARCHIVES_ROUTE]);
  }
}

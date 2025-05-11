import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { ActionButtonComponent } from 'src/app/contact/action-button/action-button.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { RoboticArmComponent } from './robotic-arm/robotic-arm.component';

@Component({
  selector: 'app-ongoing',
  standalone: true,
  imports: [ActionButtonComponent, RouterLink, RoboticArmComponent],
  templateUrl: './ongoing.component.html',
  styleUrl: './ongoing.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class OngoingComponent extends GridItemDirective implements OnInit {
  /**
   * Chemin vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Nombre de projets en cours
   */
  public count = 0;

  /**
   * Gestion de la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * OnInit implementation
   */
  ngOnInit() {
    this.supabaseService.countOngoingProjects().then(c => (this.count = c));
  }
}

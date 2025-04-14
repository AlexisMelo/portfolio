import { Component, inject } from '@angular/core';
import { ContextWithProjects } from 'src/app/landing-page/timeline/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { ActionButtonComponent } from '../../contact/action-button/action-button.component';

@Component({
  selector: 'app-projects-by-context',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './projects-by-context.component.html',
  styleUrl: './projects-by-context.component.scss',
})
export class ProjectsByContextComponent extends GridItemDirective {
  /**
   * Gestion de la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Contextes
   */
  public contexts?: Array<ContextWithProjects>;

  /**
   * Constructeur
   */
  constructor() {
    super();
    this.supabaseService.getContexts().then(c => (this.contexts = c));
  }
}

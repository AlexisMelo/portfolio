import { Component, inject } from '@angular/core';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ResumeComponent extends GridItemDirective {
  /**
   * Gestion de la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Télécharge le CV
   */
  public downloadResume() {
    this.supabaseService.getResume().then(resume => {
      const url = window.URL.createObjectURL(resume);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'CV_Alexis_Melo_da_Silva.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
    });
  }
}

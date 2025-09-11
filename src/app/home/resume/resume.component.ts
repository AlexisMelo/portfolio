import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { OutsideClickDirective } from 'src/app/shared/outside-click.directive';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [ActionButtonComponent, OutsideClickDirective],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-shadow' },
})
export class ResumeComponent extends GridItemDirective {
  /**
   * Handles database
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Modal containg the resume
   */
  @ViewChild('modal') modal?: ElementRef<HTMLDivElement>;

  /**
   * Allow DOM manipulation
   */
  private renderer = inject(Renderer2);

  /**
   * Downloads the resume
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

  /**
   * Opens the resume in full screen
   */
  public openResume() {
    this.modal?.nativeElement.removeAttribute('class');
    this.modal?.nativeElement.classList.add('opened');
    this.renderer.addClass(document.documentElement, 'modal-opened');
  }

  /**
   * Closes the resume
   */
  public closeResume() {
    this.modal?.nativeElement.classList.add('out');
    this.renderer.removeClass(document.documentElement, 'modal-opened');
  }
}

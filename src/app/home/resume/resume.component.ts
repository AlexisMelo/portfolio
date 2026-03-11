import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { OutsideClickDirective } from 'src/app/shared/outside-click.directive';

@Component({
  selector: 'app-resume',
  imports: [ActionButtonComponent, OutsideClickDirective, TranslocoPipe],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ResumeComponent
  extends GridItemDirective
  implements AfterViewInit, OnDestroy
{
  /**
   * Handles database
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Modal containing the resume
   */
  @ViewChild('modal') modal?: ElementRef<HTMLDivElement>;

  /**
   * Allow DOM manipulation
   */
  private renderer = inject(Renderer2);

  /**
   * Moves the modal to <body> to avoid position:fixed being clipped
   * by ancestor stacking contexts (e.g. position:sticky with transforms).
   */
  ngAfterViewInit() {
    if (this.modal) {
      this.renderer.appendChild(document.body, this.modal.nativeElement);
    }
  }

  /**
   * Removes the modal from <body> when the component is destroyed.
   */
  ngOnDestroy() {
    if (this.modal?.nativeElement.parentNode === document.body) {
      this.renderer.removeChild(document.body, this.modal.nativeElement);
    }
  }

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

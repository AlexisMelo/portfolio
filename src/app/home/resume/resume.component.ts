import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  linkedSignal,
  OnDestroy,
  Renderer2,
  resource,
  ViewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { LanguageService } from '../../shared/language.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { OutsideClickDirective } from 'src/app/shared/outside-click.directive';

@Component({
  selector: 'app-resume',
  imports: [ActionButtonComponent, OutsideClickDirective, TranslocoPipe],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
   * Allow DOM manipulation
   */
  private renderer = inject(Renderer2);

  /**
   * Single source of truth for the active language
   */
  private languageService = inject(LanguageService);

  /**
   * Resume links fetched from DB via personal_infos → translations,
   * re-fetched automatically on every language change.
   */
  private resumeLinks = resource({
    params: () => ({ lang: this.languageService.currentLang() }),
    loader: ({ params }) => this.supabaseService.getResumeLinks(params.lang),
  });

  /**
   * Public URL of the CV PDF for the active language
   */
  public resumePdfUrl = linkedSignal(() => this.resumeLinks.value()?.pdf ?? '');

  /**
   * Fetches the actual preview image blob when the preview path changes.
   * Creates a blob URL so the image is served from memory rather than a raw storage path.
   */
  public resumePreviewImage = resource({
    params: () => ({ links: this.resumeLinks.value() }),
    loader: async ({ params }) => {
      if (!params.links) return Promise.reject('No resume links available');
      const link = params.links.preview;
      if (!link) return Promise.reject('No preview link available');
      const blob = await this.supabaseService.getImage(link);
      return URL.createObjectURL(blob);
    },
  });

  /**
   * Modal containing the resume
   */
  @ViewChild('modal') modal?: ElementRef<HTMLDivElement>;

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
    const blobUrl = this.resumePreviewImage.value();
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  }

  /**
   * Downloads the CV for the active language.
   */
  public async downloadResume() {
    this.supabaseService.getImage(this.resumePdfUrl()).then(blob => {
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `CV_Alexis_Melo_da_Silva_${this.languageService.currentLang().toUpperCase()}.pdf`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  /**
   * Opens the resume preview modal.
   */
  public openResume() {
    this.modal?.nativeElement.removeAttribute('class');
    this.modal?.nativeElement.classList.add('opened');
    this.renderer.addClass(document.documentElement, 'modal-opened');
  }

  /**
   * Closes the resume preview modal.
   */
  public closeResume() {
    this.modal?.nativeElement.classList.add('out');
    this.renderer.removeClass(document.documentElement, 'modal-opened');
  }
}

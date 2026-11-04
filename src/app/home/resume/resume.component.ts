import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  linkedSignal,
  OnDestroy,
  Renderer2,
  resource,
  signal,
  ViewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { LanguageService } from '../../shared/language.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { OutsideClickDirective } from 'src/app/shared/outside-click.directive';

@Component({
  selector: 'app-resume',
  imports: [
    ActionButtonComponent,
    NgOptimizedImage,
    OutsideClickDirective,
    TranslocoPipe,
  ],
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
  public resumePdfUrl = linkedSignal(() =>
    this.resumeLinks.hasValue() ? this.resumeLinks.value().pdf : ''
  );

  /**
   * Whether the preview is needed: it isn't downloaded before the visitor goes for the modal
   */
  private previewRequested = signal(false);

  /**
   * Public URL of the CV preview for the active language, null until it's requested
   */
  protected resumePreviewUrl = computed(() =>
    this.previewRequested() && this.resumeLinks.hasValue()
      ? this.supabaseService.getPublicUrl(this.resumeLinks.value().preview)
      : null
  );

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
  }

  /**
   * Downloads the CV for the active language.
   */
  public downloadResume() {
    const path = this.resumePdfUrl();
    if (!path) return;

    const anchor = document.createElement('a');
    anchor.href = this.supabaseService.getPublicUrl(
      path,
      `CV_Alexis_Melo_da_Silva_${this.languageService.currentLang().toUpperCase()}.pdf`
    );
    anchor.click();
  }

  /**
   * Starts loading the preview, so it's ready when the modal opens.
   */
  protected requestPreview() {
    this.previewRequested.set(true);
  }

  /**
   * Opens the resume preview modal.
   */
  public openResume() {
    this.requestPreview();
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

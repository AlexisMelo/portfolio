import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';
import { ThemeService } from '../shared/theme.service';
import { ContentService } from '../shared/content.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements AfterViewInit {
  /**
   * Element HTML contenant le titre
   */
  @ViewChild('title') title?: ElementRef;

  /**
   * Element HTML contenant le texte placeholder
   */
  @ViewChild('placeholder') placeholder?: ElementRef;

  /**
   * Contenu du titre
   */
  public titleContent: string = 'MELO';

  /**
   * Référence au timer
   */
  private typewriterInterval?: number;

  /**
   * Temps de l'effet typewriting
   */
  private typingDuration = 1000;

  /**
   * Gestion du thème
   */
  public themeService = inject(ThemeService);

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Applique l'effet "typewriter" à un element
   * @param i
   */
  private typewrite() {
    let i = 0;

    this.typewriterInterval = window.setInterval(() => {
      if (i >= this.titleContent.length || !this.title || !this.placeholder) {
        clearInterval(this.typewriterInterval);
        return;
      }
      this.title.nativeElement.innerHTML += this.titleContent.charAt(i);
      this.placeholder.nativeElement.innerHTML =
        this.placeholder.nativeElement.innerHTML.substring(1);
      i++;
    }, this.typingDuration / this.titleContent.length);
  }

  /**
   * Implémentation de AfterViewInit
   */
  ngAfterViewInit(): void {
    this.typewrite();
  }
}

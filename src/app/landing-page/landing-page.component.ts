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
import { ButtonComponent } from '../shared/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { MovingContentComponent } from '../shared/moving-content/moving-content.component';
import { SupabaseService } from '../shared/supabase.service';
import { Skill } from '../projects/skill.model';
import { TooltipDirective } from '../shared/tooltip/tooltip.directive';
import { Section } from '../projects/section.model';
import { SectionGroupComponent } from '../projects/project-details/section-group/section-group.component';
import { TitleSeparatorComponent } from '../shared/title-separator/title-separator.component';
import { ContextWithProjects } from './timeline/context-with-projects.model';
import { RowWithSeparatorComponent } from '../shared/row-with-separator/row-with-separator.component';
import { SkillFrontPageComponent } from './skill/skill-front-page/skill-front-page.component';
import { ARCHIVES_ROUTE } from '../app.routes';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    TimelineComponent,
    ButtonComponent,
    MovingContentComponent,
    RouterLink,
    TooltipDirective,
    SectionGroupComponent,
    TitleSeparatorComponent,
    RowWithSeparatorComponent,
    SkillFrontPageComponent,
  ],
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
   * Route vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

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
   * Gestion des routes
   */
  private router = inject(Router);

  /**
   * Gestion des données en base
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Skills
   */
  public skills: Array<Skill> = [];

  /**
   * Sections
   */
  public sections: Array<Section> = [];

  /**
   * Clients
   */
  public clients: Array<ContextWithProjects> = [];

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

    this.supabaseService
      .getSkills()
      .then(skills => (this.skills = skills.filter(s => s.landing_page)));

    this.supabaseService
      .getLandingSections()
      .then(sections => (this.sections = sections));

    this.supabaseService
      .getLandingClients()
      .then(contexts => (this.clients = contexts));
  }

  /**
   * Redirection vers la page de contact
   */
  goToContact() {
    this.router.navigate(['contact']);
  }
}

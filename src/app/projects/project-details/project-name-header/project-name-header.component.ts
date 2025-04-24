import { Component, HostBinding, inject, Input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';
import { StatusPipe } from '../../status/status.pipe';
import { KebabCasePipe } from 'src/app/shared/pipes/kebab-case.pipe';

@Component({
  selector: 'app-project-name-header',
  standalone: true,
  imports: [],
  templateUrl: './project-name-header.component.html',
  styleUrl: './project-name-header.component.scss',
  providers: [StatusPipe, KebabCasePipe],
})
export class ProjectNameHeaderComponent extends GridItemDirective {
  /**
   * Projet à afficher dans le composant
   */
  @Input({ required: true }) project!: Project;

  /**
   * Obtient le statut d'un projet
   */
  private statusPipe = inject(StatusPipe);

  /**
   * Transforme une chaine de caractère en kebabcase
   */
  private kebabCasePipe = inject(KebabCasePipe);

  /**
   * Bind le statut du projet à une classe
   */
  @HostBinding('class') get projectStatus() {
    return this.statusPipe.transform(this.project);
  }
}

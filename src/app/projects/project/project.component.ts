import { Component, Input } from '@angular/core';
import { Project } from '../project.model';
import { RightArrowComponent } from "../../landing-page/timeline/right-arrow/right-arrow.component";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [RightArrowComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  /**
   * Project to display
   */
  @Input({required: true}) project!: Project;
}

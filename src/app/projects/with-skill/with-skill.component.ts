import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { MosaiqueWebsitesComponent } from '../mosaique-websites/mosaique-websites.component';

@Component({
  selector: 'app-with-skill',
  standalone: true,
  imports: [MosaiqueWebsitesComponent],
  templateUrl: './with-skill.component.html',
  styleUrl: './with-skill.component.scss',
})
export class WithSkillComponent extends GridItemDirective {}

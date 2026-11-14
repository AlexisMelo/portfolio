import { Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ProjectsService } from '../projects.service';

/**
 * Tile searching the projects by keyword: their name, description, type, context or skills
 */
@Component({
  selector: 'app-project-filtering',
  imports: [ReactiveFormsModule, MatIconModule, TranslocoPipe],
  templateUrl: './project-filtering.component.html',
  styleUrl: './project-filtering.component.scss',
})
export class ProjectFilteringComponent extends GridItemDirective {
  /**
   * Projects, filters and their results
   */
  private readonly projectsService = inject(ProjectsService);

  /**
   * Text typed in the search field
   */
  protected readonly filterFormControl = new FormControl('');

  /**
   * Constructor
   */
  constructor() {
    super();

    // Half a second after the last key, so that the list does not change with every letter
    this.filterFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(value => this.projectsService.filter.set(value));

    // Empties the field when another tile clears the filters
    effect(() => {
      this.filterFormControl.setValue(this.projectsService.filter());
    });
  }
}

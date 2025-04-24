import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../project.model';
import { Status } from './status.model';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(project: Project): Status {
    if (project.abandoned) return 'abandoned';
    if (!project.end_date) return 'ongoing';
    return 'completed';
  }
}

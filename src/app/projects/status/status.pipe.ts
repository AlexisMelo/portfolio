import { Pipe, PipeTransform } from '@angular/core';
import { Tables } from 'database.types';
import { Status } from './status.model';

/**
 * Status of a project: abandoned, ongoing (no end date) or completed
 * @param project project, with its end date and whether it was abandoned
 */
export function getProjectStatus(
  project: Pick<Tables<'project'>, 'abandoned' | 'end_date'>
): Status {
  if (project.abandoned) return 'abandoned';
  if (!project.end_date) return 'ongoing';
  return 'completed';
}

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(
    project: Pick<Tables<'project'>, 'abandoned' | 'end_date'>
  ): Status {
    return getProjectStatus(project);
  }
}

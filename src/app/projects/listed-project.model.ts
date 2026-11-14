import { Tables } from 'database.types';

/**
 * Project as displayed and filtered on the projects page
 */
export interface ListedProject extends Pick<
  Tables<'project'>,
  'id' | 'label' | 'url' | 'start_date' | 'end_date' | 'abandoned' | 'pinned'
> {
  /** Type of the project (website, desktop app, ...), displayed and used by the category filter. */
  project_type: Pick<Tables<'project_type'>, 'id' | 'label'> | null;

  /** Context of the project, used by the context, category and text filters. */
  project_context: Pick<Tables<'context'>, 'id' | 'label'>;

  /** Skills used in the project, used by the skill, category and text filters. */
  project_skills: Array<{
    skill: Pick<Tables<'skill'>, 'id' | 'label'>;
  }>;

  /** Localized description resolved from the translations table. */
  localizedDescription: Pick<Tables<'translations'>, 'en' | 'fr'> | null;
}

/**
 * Project of the list, with its number: its rank among every project, the oldest being n°1
 */
export interface NumberedProject {
  /** Project to display. */
  project: ListedProject;

  /** Rank of the project among every project, by end date, the ongoing ones last. */
  number: number;
}

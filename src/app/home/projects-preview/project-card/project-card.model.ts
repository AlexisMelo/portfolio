import { Tables } from 'database.types';

/**
 * What a project card displays of a project
 */
export interface ProjectCard extends Pick<
  Tables<'project'>,
  'id' | 'label' | 'url' | 'end_date' | 'icon'
> {
  /** Description, from the translations table */
  localizedDescription: Pick<Tables<'translations'>, 'en' | 'fr'> | null;

  /** Illustrations, the one with the lowest position being displayed */
  illustrations: Array<
    Pick<Tables<'project_illustration'>, 'url' | 'alt' | 'position'>
  >;

  /** Context of the project, with its label from the translations table */
  project_context: {
    localizedLabel: Pick<Tables<'translations'>, 'en' | 'fr'> | null;
  };
}

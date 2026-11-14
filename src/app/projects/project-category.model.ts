import { ListedProject } from './listed-project.model';

/**
 * Categories of the chips above the project list, a project being in one or more of them.
 * No category selected shows every project.
 */
export const PROJECT_CATEGORIES = [
  'featured',
  'angular',
  'company',
  'personal',
] as const;

/**
 * Category of projects: featured (pinned on the home page), built with Angular, made in a company
 * (any context but the personal one and the schools), or personal
 */
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * Id of the "all" chip, which takes the focus when the filters are cleared: the button clearing
 * them disappears with them
 */
export const ALL_CATEGORIES_CHIP_ID = 'projects-category-all';

/**
 * Id of the Angular skill, in the skill table
 */
export const ANGULAR_SKILL_ID = 2;

/**
 * Id of the personal projects context, in the context table
 */
export const PERSONAL_CONTEXT_ID = 9;

/**
 * Ids of the school contexts (INSA, IUT, high school), in the context table. Every other context
 * but the personal one is a company, so that a new job or freelance context needs no change here.
 */
export const SCHOOL_CONTEXT_IDS: ReadonlyArray<number> = [3, 6, 8];

/**
 * Translation keys of the project types (projects.types.*), by id in the project_type table,
 * whose labels are only in French
 */
export const PROJECT_TYPE_KEYS: Readonly<Record<number, string>> = {
  1: 'website',
  2: 'desktop',
  3: 'other',
};

/**
 * Whether a value from the URL is a project category
 * @param value query param value
 */
export function isProjectCategory(
  value: string | null
): value is ProjectCategory {
  return PROJECT_CATEGORIES.some(category => category === value);
}

/**
 * Whether a project is in a category
 * @param project project to check
 * @param category selected category
 */
export function projectIsInCategory(
  project: ListedProject,
  category: ProjectCategory
): boolean {
  const contextId = project.project_context.id;

  switch (category) {
    case 'featured':
      return project.pinned;
    case 'angular':
      return project.project_skills.some(s => s.skill.id === ANGULAR_SKILL_ID);
    case 'company':
      return (
        contextId !== PERSONAL_CONTEXT_ID &&
        !SCHOOL_CONTEXT_IDS.includes(contextId)
      );
    case 'personal':
      return contextId === PERSONAL_CONTEXT_ID;
  }
}

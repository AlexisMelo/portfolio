import { SCHOOL_CONTEXT_IDS } from '../projects/project-category.model';
import { ContextWithProjects } from '../projects/context-with-projects.model';

/**
 * Kinds of steps of the path, in the order of the filter chips after the "all" one
 */
export const EXPERIENCE_KINDS = ['pro', 'school'] as const;

/**
 * Kind of a step of the path: a job or an internship, or a school
 */
export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number];

/**
 * Kind of a step, the schools being known by their ids since the context table has no kind column
 * @param context step of the path
 */
export function experienceKind(context: ContextWithProjects): ExperienceKind {
  return SCHOOL_CONTEXT_IDS.includes(context.id) ? 'school' : 'pro';
}

// Route paths, kept apart from app.routes.ts so that the lazy-loaded pages can use them
// without importing the route definitions that load them.

/**
 * Experience path, relative to the root route
 */
export const RELATIVE_EXPERIENCE_ROUTE = 'experience';

/**
 * Absolute experience path, for navigation
 */
export const EXPERIENCE_ROUTE = '/' + RELATIVE_EXPERIENCE_ROUTE;

/**
 * Skills path, relative to the root route
 */
export const RELATIVE_SKILLS_ROUTE = 'skills';

/**
 * Absolute skills path, for navigation
 */
export const SKILLS_ROUTE = '/' + RELATIVE_SKILLS_ROUTE;

/**
 * Path of the list of every project, relative to the root route
 */
export const RELATIVE_PROJECTS_ROUTE = 'projects';

/**
 * Absolute path of the list of every project, for navigation
 */
export const PROJECTS_ROUTE = '/' + RELATIVE_PROJECTS_ROUTE;

// Route paths, kept apart from app.routes.ts so that the lazy-loaded pages can use them
// without importing the route definitions that load them.

/**
 * Archives path, relative to the root route
 */
export const RELATIVE_ARCHIVES_ROUTE = 'projects/archives';

/**
 * Absolute archives path, for navigation
 */
export const ARCHIVES_ROUTE = '/' + RELATIVE_ARCHIVES_ROUTE;

/**
 * Experience path, relative to the root route
 */
export const RELATIVE_EXPERIENCE_ROUTE = 'experience';

/**
 * Absolute experience path, for navigation
 */
export const EXPERIENCE_ROUTE = '/' + RELATIVE_EXPERIENCE_ROUTE;

/**
 * Projects path, relative to the root route
 */
export const RELATIVE_PROJECTS_ROUTE = 'projects';

/**
 * Absolute projects path, for navigation
 */
export const PROJECTS_ROUTE = '/' + RELATIVE_PROJECTS_ROUTE;

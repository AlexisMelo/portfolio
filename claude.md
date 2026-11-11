# Portfolio

Personal portfolio website of Alexis Melo, a freelance fullstack web developer specialised in Angular. It presents the developer's profile, projects, skills and work experience to prospective clients, and its main goal is getting them to make contact: mail, availability, resume download, "your project here" tile.

## Angular skill and MCP

- The `angular-developer` skill is the reference for every Angular decision. Load it before writing, changing or reviewing Angular code. When it conflicts with anything in this file, the skill wins.
- Use the `angular-cli` MCP server:
  - `search_documentation` to check Angular APIs against angular.dev instead of relying on memory.
  - `run_target` for the build, test and lint runs the skill requires, and `devserver_start` + `devserver_wait_for_build` to check a change in the dev server.

## Domain

- Routes ([app.routes.ts](src/app/app.routes.ts)):
  - `/`: about page (description, availability, resume, map, "now" items, contact links, pinned projects).
  - `/projects`: every project, filterable by status, context, skill and free text, grouped by end year, with the ongoing and Angular project counts, the "your project here" tile and the GitHub link. Filters follow the query params; state lives in `ProjectsService`, provided by the component.
  - `/projects/:url`: project details (context, problem, contribution, skills, coworkers, illustrations, live link, source code).
  - `/skills`: frontend, backend and general sections, with favourite skills highlighted.
  - `/experience`: professional contexts with their projects.
- Content is not in the codebase. It all comes from Supabase through `SupabaseService` ([supabase.service.ts](src/app/shared/supabase.service.ts)) and arrives after the first render. Tables: `project`, `context`, `skill`, `project_skill`, `personal_infos`, `translations`; images are in the `portfolio-project` storage bucket. DB types are in `database.types.ts`, regenerated with `npm run build-supabase-types`.

## Project conventions

- Layout: every page is a `.g-grid` of tiles; global `g-` classes are in [styles.scss](src/styles/styles.scss). A tile extends `GridItemDirective` or uses it as a host directive, which adds the `g-grid-item` class and a fade-in (`animate.enter`). Page grids use the `appGridEntrance` directive ([grid-entrance.directive.ts](src/app/shared/grid/grid-entrance.directive.ts)) for a staggered entrance, which replaces the fade-in of the tiles present when the grid first renders. Grids whose tiles are rendered once Supabase data arrives also set `staggerAddedTiles`, which staggers the newly added tiles. To replay the stagger on tiles already displayed each time the results change (projects page), bind `[replayKey]` to a key of the displayed results and set `replaySelector`.
- Drag and drop: page grids also use `appGridDrag` ([grid-drag.directive.ts](src/app/shared/grid/grid-drag.directive.ts)), which lets visitors move tiles (mouse: press and move; touch: long press). A dropped tile swaps places with the tiles it lands on or pushes them down, then every tile rises as far as it can, so no space is left empty above a tile ([grid-layout.ts](src/app/shared/grid/grid-layout.ts)). Positions are written as inline `grid-column` / `grid-row` and never saved: the CSS layout comes back on reload, when the window width changes and when tiles are added or removed. The navbar grid has no drag.
- Animations are native CSS, with `animate.enter` / `animate.leave` for elements entering or leaving the DOM. The deprecated `@angular/animations` package is not installed.
- i18n: Transloco with `en` (default) and `fr`. Every UI string, including alt texts and ARIA labels, needs a key in both [en.json](public/i18n/en.json) and [fr.json](public/i18n/fr.json). Database content is translated through the `translations` table (`localizedLabel`, `localizedDescription`, ...), picked with `LanguageService.currentLang()`.
- Theming: `ThemeService` puts `dark-mode` or `light-mode` on `<body>`. Theme colours are in [dark-mode.scss](src/styles/dark-mode.scss) and [light-mode.scss](src/styles/light-mode.scss); a new colour needs a value in both.
- Fonts are loaded from Google Fonts in [index.html](src/index.html), restricted to what is used:
  - Text: Bricolage Grotesque 400–700 at optical size 32 (titles) and Geist 400 and 700 (body), no italics. A new weight or italic must be added to the link, or the browser falls back to the nearest loaded one.
  - Icons: `<mat-icon>` uses a Material Symbols Outlined subset, filled by default (`'FILL' 1` in [styles.scss](src/styles/styles.scss)). A new icon name must be added to the link's `icon_names`, in alphabetical order, or it renders as its ligature text.
- Unit tests run on Karma + Jasmine (`ng test`), not Vitest.
- Pushing to `main` deploys to production: GitHub Actions builds the Docker image (nginx serving the browser build) and redeploys it on the VPS.

## Rules the skill does not cover

- Accessibility: pages MUST pass all AXE checks and meet WCAG AA, including focus management, colour contrast in both themes and ARIA attributes.
- Use `NgOptimizedImage` for static images (it does not work for inline base64 images).
- Avoid `any`; use `unknown` when the type is uncertain.
- Write short English documentation for new functions and new component fields.
- Edit files with your own tools, not Node or Python scripts. Angular CLI commands the skill asks for (`ng generate`, `ng build`) are fine.

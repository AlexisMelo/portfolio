# Lighthouse performance report

- **Date:** 2026-11-03, commit `d19e216`
- **Tool:** Lighthouse 13.6.0, performance category, local production build (see [How to measure](#2-how-to-measure))
- **Goal:** mobile score ≥ 0.90 on every page, without losing the AXE / WCAG AA compliance required by `CLAUDE.md`

---

## 1. Summary

Mobile is the problem; desktop is already at 0.99–1.00 everywhere except one layout shift on `/experience`.
Every mobile page loses its points on **LCP** (Largest Contentful Paint). FCP is 0.6 s everywhere, and TBT and CLS are mostly fine.

| Page                 | Mobile score (median of 3) | LCP   | TBT    | CLS   | LCP element                                                          | Desktop score        |
| -------------------- | -------------------------- | ----- | ------ | ----- | -------------------------------------------------------------------- | -------------------- |
| `/`                  | **0.82** (0.81–0.83)       | 4.7 s | 102 ms | 0.023 | A Leaflet map tile                                                   | 0.99                 |
| `/projects`          | **0.88** (0.86–0.89)       | 3.8 s | 106 ms | 0.021 | First pinned project's illustration (2 of 3 runs) or its description | 1.00                 |
| `/projects/archives` | **0.88** (0.88–0.88)       | 3.8 s | 121 ms | 0.052 | Page description text                                                | 0.99                 |
| `/skills`            | **0.85** (0.84–0.87)       | 4.1 s | 59 ms  | 0.084 | "Keep learning" tile text                                            | 0.99                 |
| `/experience`        | **0.90** (0.89–0.90)       | 3.4 s | 103 ms | 0.080 | "Curriculum Vitae" heading                                           | **0.77** (CLS 0.589) |
| `/projects/uloa`     | **0.79** (0.79–0.80)       | 4.8 s | 152 ms | 0.081 | First carousel illustration                                          | 0.99                 |

For reference, Lighthouse rates a mobile LCP under 2.5 s as "good". `/experience` already reaches 0.90 with an LCP of 3.4 s, so getting LCP under about 3 s on every page should meet the 0.90 goal.

The three causes behind almost every finding:

1. **Images from the Supabase bucket are full-size PNGs**, often 1–1.6 MB each and up to 389 KB for a skill icon. Lists load all of them at once, with no lazy loading or size: 10 MB on `/projects/archives`, 3.7 MB on `/skills`.
2. **Every page waits for JavaScript and then Supabase** before showing its content. The initial JavaScript is 790 KB uncompressed (208 KB gzipped), and about a third of it isn't needed on first load.
3. **The home page map** downloads about 10 high-resolution tiles during a zoom animation, and one of them becomes the LCP element.

---

## 2. How to measure

### Local production build

```bash
npx ng build
npx serve@14.2.4 --no-port-switching -s dist/portfolio/browser -l 4300   # gzip + SPA fallback, close to nginx.conf
```

### Lighthouse command

Lighthouse's default Chrome flags include `--disable-extensions`. **Cold Turkey Blocker kills any Chrome started with that flag** a few seconds in, so runs fail at random ("Session closed", "Connection closed", NO_FCP). The command below keeps Lighthouse's other default flags and drops only that one:

```bash
FLAGS="--headless=new --disable-features=Translate,OptimizationHints,MediaRouter,DialMediaRouteProvider,CalculateNativeWinOcclusion,InterestFeedContentSuggestions,CertificateTransparencyComponentUpdater,AutofillServerCommunication,PrivacySandboxSettings4,RenderDocument --disable-component-extensions-with-background-pages --disable-background-networking --disable-component-update --disable-client-side-phishing-detection --disable-sync --metrics-recording-only --disable-default-apps --mute-audio --no-default-browser-check --no-first-run --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling --disable-ipc-flooding-protection --password-store=basic --use-mock-keychain --force-fieldtrials=*BackgroundTracing/default/ --disable-hang-monitor --disable-prompt-on-repost --disable-domain-reliability --propagate-iph-for-testing"

# mobile (default); add --preset=desktop for desktop
npx lighthouse@13.6.0 http://localhost:4300/projects --only-categories=performance \
  --chrome-ignore-default-flags --chrome-flags="$FLAGS" --view
```

Pages audited: `/`, `/projects`, `/projects/archives`, `/skills`, `/experience`, `/projects/uloa` (project details).

### Rules for comparing runs

- **Run each page 3 times and keep the median.** Mobile scores vary by about ±0.05 between identical runs.
- **Compare only runs made with the same command.** A trimmed flag set gave FCP 2.0 s instead of 0.6 s on `/`.
- **Run audits one at a time.** Parallel runs compete for CPU.
- **Be suspicious of a mobile 1.00 with LCP around 0.6 s.** Lighthouse simulates LCP: when a text LCP paints in the same frame as the first paint, LCP equals the simulated FCP (0.6 s), and one frame later it's 3.3–3.8 s. Compare `observedFirstContentfulPaint` and `observedLargestContentfulPaint` in the `metrics` audit before believing a jump.
- **Serve copies of the builds without `ngsw-worker.js` when comparing them.** Requests answered through the service worker report `transfer: 0`, and whether it takes control in time varies between builds. It made `/projects/archives` look 1.4 MB lighter and `/projects` score 0.92 instead of 0.85. `--blocked-url-patterns` doesn't stop it. If bytes drop by more than the code you removed, suspect this first.
- **Check which build answers.** Without `--no-port-switching`, `serve` moves to a random port when its port is taken, and whatever holds that port keeps answering. Compare the `main-*.js` in the response with the one in the build's `index.html`, and stop the servers afterwards.
- **Local runs flatter the site.** There's no real server latency. Once changes are deployed, check production with [PageSpeed Insights](https://pagespeed.web.dev/) (mobile).

---

## 3. Work items

Each item lists the problem, the evidence from the audits, the fix, the files involved and when to consider it done. The order within each priority is the suggested order.

### P1: LCP fixes (biggest gains, low risk)

#### P1.1 Compress the images in the Supabase bucket

- [x] 36 project illustrations
- [x] 25 skill icons already in the bucket
- [x] 22 skill icons hosted elsewhere: download them and upload them into the bucket
- [x] 3 project icons
- [x] 2 CV previews
- [x] Run [p1.1-update-image-urls.sql](p1.1-update-image-urls.sql) in the Supabase SQL editor
- [x] Delete the original files from the bucket once the site is checked

**Problem.** Images are uploaded as full-size PNGs and displayed much smaller.

The heavy images also slow pages whose LCP element is text (`/projects/archives`, `/skills`). Lighthouse's simulated throttling counts the requests still downloading when the text paints, so those downloads delay it.

**Evidence.**

| Page                 | Image requests | Image weight | Lighthouse "image delivery" savings       |
| -------------------- | -------------- | ------------ | ----------------------------------------- |
| `/projects/archives` | 19             | 9.7 MB       | 9.6 MB                                    |
| `/skills`            | 26             | 2.7 MB       | 1.2 MB or more (one run estimated 3.1 MB) |
| `/projects/uloa`     | 13             | 1.0 MB       | 606 KB                                    |
| `/projects`          | 3              | 892 KB       | 858 KB                                    |

- **Inventory of the database on 2026-11-03:** 199 distinct images, 22 MB of them in the 36 illustrations listed below.
- **Example of the size gap:** `mes_infos_tracability.png` is 1919×1032 but displayed at 383×206.
- **Externally hosted icons:** 22 skill icons come from 16 other hosts (`upload.wikimedia.org`, `cdn-icons-png.flaticon.com`, `github.com`, …). Each extra origin costs a new connection (~330 ms each according to Lighthouse).

**Fix.** Convert each file to WebP and upload it next to the original, with the same path and a `.webp` extension (`skill-icons/angular.png` → `skill-icons/angular.webp`). The conversion was done on 2026-11-03 with a Pillow script: the 88 files go from 26.3 MB to 3.6 MB, the three GIFs (animated WebP) making up 1.3 MB of that. Then run [p1.1-update-image-urls.sql](p1.1-update-image-urls.sql), which points the database to the new files. It only switches the rows whose WebP file is already in the bucket, so it can be run again after each batch.

| Images        | Displayed at                                  | Target                                                                 |
| ------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| Illustrations | Up to full screen in the illustrations dialog | At most 1600 px wide, WebP quality ~80. The GIFs become animated WebP. |
| Skill icons   | 30×30                                         | 96 px on the longest side, WebP with transparency                      |
| Project icons | Half a grid cell                              | 256×256, WebP                                                          |
| CV previews   | Resume modal                                  | Same size (595×842), WebP                                              |

The 1600 px limit replaces the 800 px suggested in the first version of this report: the dialog shows the same file full screen, and an 800 px screenshot would look blurry there.

Not needed:

- Illustrations under 100 KB and at most 1600 px wide, and `pokemon-maitre-dresseur/pic19096.webp` (already WebP).
- Coworker photos (`coworkers/bust_*`): 13–48 KB each, displayed 100 px tall.
- `coworkers/head_*`: the `avatar_head` column isn't used by the app.

**Illustrations** (sorted by size)

| File                                                                 | Size    | Dimensions | Resize to            |
| -------------------------------------------------------------------- | ------- | ---------- | -------------------- |
| `projects/share-instru/product-details-shareinstru.gif`              | 2074 KB | 1481×883   | keep (animated WebP) |
| `projects/share-instru/my-insruments-shareinstru.gif`                | 1977 KB | 1481×883   | keep (animated WebP) |
| `projects/puissance-4/client-raspberry.png`                          | 1595 KB | 1600×900   | keep                 |
| `projects/pierre-feuille-ciseaux/affichage_main_mediapipe.png`       | 1553 KB | 1363×771   | keep                 |
| `projects/pic-lapis/lapis_config_annotation.png`                     | 1516 KB | 1918×995   | 1600×830             |
| `projects/share-instru/welcome-page-shareinstru.png`                 | 1502 KB | 1845×849   | 1600×736             |
| `projects/horrifying-pirate-from-hell/pirate_landing_screen.png`     | 1478 KB | 993×700    | keep                 |
| `projects/share-instru/maquette-share-instru.PNG`                    | 1306 KB | 1351×961   | keep                 |
| `projects/cold lemonade/lemonade_songs.png`                          | 1046 KB | 1912×920   | 1600×770             |
| `projects/cold lemonade/illustrations.jpg`                           | 701 KB  | 2362×2362  | 1600×1600            |
| `projects/app-vue-leaflet/vue_leaflet_laigle.png`                    | 673 KB  | 1600×820   | keep                 |
| `projects/share-instru/city-finder-shareinstru.gif`                  | 501 KB  | 508×359    | keep (animated WebP) |
| `projects/cold lemonade/lemonade_front_page.png`                     | 483 KB  | 1912×920   | 1600×770             |
| `projects/mes-client/mes_client_depose_colle.png`                    | 477 KB  | 1689×950   | 1600×900             |
| `projects/altaterra/altaterra extrait.png`                           | 467 KB  | 1650×869   | 1600×843             |
| `projects/portfolio/portfolio_maquette_all_projects.png`             | 451 KB  | 1912×920   | 1600×770             |
| `projects/mes-client/mes_client_vissage.png`                         | 429 KB  | 1689×950   | 1600×900             |
| `projects/puissance-4/client-minecraft.png`                          | 429 KB  | 1600×839   | keep                 |
| `projects/horrifying-pirate-from-hell/pirate_player_selection.png`   | 380 KB  | 594×799    | keep                 |
| `projects/shing-shang/shing shang diagramme de classe.png`           | 358 KB  | 1600×1057  | keep                 |
| `projects/app-vue-leaflet/vue_leaflet_no_data.png`                   | 350 KB  | 1600×821   | keep                 |
| `projects/horrifying-pirate-from-hell/pirate_board.png`              | 343 KB  | 565×432    | keep                 |
| `projects/pic-lapis/pic-lapis.png`                                   | 299 KB  | 1877×1007  | 1600×858             |
| `projects/pokemon-maitre-dresseur/pokemon_maitre_dresseur_boite.jpg` | 222 KB  | 1280×720   | keep                 |
| `projects/axi-to-html/axi-to-html.png`                               | 210 KB  | 1912×920   | 1600×770             |
| `projects/portfolio/portfolio_home.png`                              | 190 KB  | 1889×912   | 1600×772             |
| `projects/pokemon-maitre-dresseur/pokemon_maitre_dresseur.png`       | 182 KB  | 1912×920   | 1600×770             |
| `projects/pic-lapis/lapis_metrics.png`                               | 155 KB  | 1881×1009  | 1600×858             |
| `projects/mes_infos/mes_infos_tracability.png`                       | 146 KB  | 1919×1032  | 1600×860             |
| `projects/mes_infos_processflow/mes_infos_process_flow.png`          | 137 KB  | 1888×910   | 1600×771             |
| `projects/mes_infos_processflow/editeur_processflow.png`             | 110 KB  | 1920×1032  | 1600×860             |
| `projects/worklog-metrics-bot/project RDT verbosed.png`              | 104 KB  | 599×730    | keep                 |
| `projects/puissance-4/client-web.png`                                | 104 KB  | 1491×897   | keep                 |
| `projects/portfolio/portfolio_all_projects.png`                      | 95 KB   | 1886×910   | 1600×772             |
| `projects/mes_infos/palettes.png`                                    | 85 KB   | 1920×1032  | 1600×860             |
| `projects/mes_infos/mes_infos_stations.png`                          | 77 KB   | 1894×916   | 1600×774             |

**Skill icons in the bucket** (all resized to 96 px on the longest side)

| File                                | Size   | Dimensions |
| ----------------------------------- | ------ | ---------- |
| `skill-icons/angular.png`           | 389 KB | 880×934    |
| `skill-icons/osm.png`               | 256 KB | 474×474    |
| `skill-icons/php.png`               | 169 KB | 474×484    |
| `skill-icons/postgresql.png`        | 163 KB | 1014×634   |
| `skill-icons/react.png`             | 159 KB | 474×474    |
| `skill-icons/wpf.png`               | 128 KB | 533×228    |
| `skill-icons/raspberry.png`         | 116 KB | 1134×1367  |
| `skill-icons/netcore.png`           | 107 KB | 489×511    |
| `skill-icons/csharp.png`            | 106 KB | 474×474    |
| `skill-icons/fabric.png`            | 105 KB | 414×340    |
| `skill-icons/bootstrap.png`         | 96 KB  | 560×446    |
| `skill-icons/html.png`              | 96 KB  | 500×500    |
| `skill-icons/netframework.png`      | 94 KB  | 666×375    |
| `skill-icons/web.png`               | 93 KB  | 612×408    |
| `skill-icons/git.png`               | 82 KB  | 500×500    |
| `skill-icons/claude.png`            | 78 KB  | 3840×3823  |
| `skill-icons/leaflet.png`           | 76 KB  | 547×456    |
| `skill-icons/symfony.png`           | 73 KB  | 500×500    |
| `skill-icons/supabase.png`          | 70 KB  | 436×449    |
| `skill-icons/vue.png`               | 67 KB  | 474×410    |
| `skill-icons/socket.png`            | 61 KB  | 577×433    |
| `skill-icons/slack.png`             | 54 KB  | 666×375    |
| `skill-icons/github.png`            | 50 KB  | 500×500    |
| `skill-icons/expressjs.png`         | 12 KB  | 272×247    |
| `logo-typescript.png` (bucket root) | 11 KB  | 512×512    |

**Skill icons hosted elsewhere.** Upload SVGs as they are. Resize the others to 96 px on the longest side, as WebP. The Gitlab one is a 1200×675 banner, not an icon: a proper logo would read better at 30×30.

| Skill        | Current host                                                                                                                                                               | Size  | Dimensions | Upload as                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------- | ------------------------------ |
| C            | [upload.wikimedia.org](https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png)                                                                                     | 23 KB | 360×405    | `skill-icons/c.webp`           |
| CSS          | [upload.wikimedia.org](https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg)                                                                                  | 1 KB  | SVG        | `skill-icons/css-logo.svg`     |
| Django       | [www.svgrepo.com](https://www.svgrepo.com/show/353657/django-icon.svg)                                                                                                     | 2 KB  | SVG        | `skill-icons/django-logo.svg`  |
| Docker       | [user.oc-static.com](https://user.oc-static.com/upload/2021/11/10/1636542639252_Moby-logo.png)                                                                             | 22 KB | 601×431    | `skill-icons/docker.webp`      |
| Figma        | [upload.wikimedia.org](https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg)                                                                                 | 1 KB  | SVG        | `skill-icons/figma.svg`        |
| Gitlab CI/CD | [nextlinklabs.com](https://nextlinklabs.com/hubfs/Imported_Blog_Media/git-lab-social-header.png)                                                                           | 5 KB  | 1200×675   | `skill-icons/gitlab.webp`      |
| Java         | [cdn-icons-png.flaticon.com](https://cdn-icons-png.flaticon.com/512/226/226777.png)                                                                                        | 16 KB | 512×512    | `skill-icons/java.webp`        |
| Javascript   | [upload.wikimedia.org](https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png)                                                                            | 10 KB | 1052×1052  | `skill-icons/javascript.webp`  |
| Jira API     | [cdn-icons-png.flaticon.com](https://cdn-icons-png.flaticon.com/512/5968/5968875.png)                                                                                      | 23 KB | 512×512    | `skill-icons/jira.webp`        |
| Jquery       | [cdn.worldvectorlogo.com](https://cdn.worldvectorlogo.com/logos/jquery-4.svg)                                                                                              | 4 KB  | SVG        | `skill-icons/jquery.svg`       |
| Labelstudio  | [cdn.prod.website-files.com](https://cdn.prod.website-files.com/640393c340112160177a8028/648c011a3f76e5ce367d258e_78195de6-6238-4abc-8ebf-d9711b0ba80b_256x256.png)        | 1 KB  | 256×256    | `skill-icons/labelstudio.webp` |
| Materialize  | [uxwing.com](https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/materialize-css-logo-icon.png)                                                   | 4 KB  | 512×512    | `skill-icons/materialize.webp` |
| Mediapipe    | [res.cloudinary.com](https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/mediapipe_icon.png) | 5 KB  | 1080×1080  | `skill-icons/mediapipe.webp`   |
| Minecraft    | [images.icon-icons.com](https://images.icon-icons.com/2699/PNG/512/minecraft_logo_icon_168974.png)                                                                         | 79 KB | 512×512    | `skill-icons/minecraft.webp`   |
| Nginx        | [www.svgrepo.com](https://www.svgrepo.com/show/373924/nginx.svg)                                                                                                           | 1 KB  | SVG        | `skill-icons/nginx-logo.svg`   |
| Node.js      | [humancoders-formations.s3.eu-west-1.amazonaws.com](https://humancoders-formations.s3.eu-west-1.amazonaws.com/uploads/course/logo/14/thumb_bigger_formation-node-js.png)   | 26 KB | 377×420    | `skill-icons/nodejs.webp`      |
| Notion       | [upload.wikimedia.org](https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png)                                                                            | 11 KB | 512×512    | `skill-icons/notion.webp`      |
| OpenCV       | [github.com](https://github.com/opencv/opencv/wiki/logo/OpenCV_logo_no_text.png)                                                                                           | 89 KB | 2623×2436  | `skill-icons/opencv.webp`      |
| Oracle       | [images.icon-icons.com](https://images.icon-icons.com/2699/PNG/512/oracle_logo_icon_168918.png)                                                                            | 5 KB  | 512×512    | `skill-icons/oracle.webp`      |
| Python       | [thumbnail.imgbin.com](https://thumbnail.imgbin.com/7/24/5/imgbin-python-logo-clojure-javascript-9-blue-and-yellow-logo-sqQcsxjigHvJJ509HK3VxuXeW_t.jpg)                   | 12 KB | 310×308    | `skill-icons/python.webp`      |
| SCSS         | [cdn-icons-png.flaticon.com](https://cdn-icons-png.flaticon.com/512/5968/5968358.png)                                                                                      | 30 KB | 512×512    | `skill-icons/scss.webp`        |
| SQL Server   | [img.icons8.com](https://img.icons8.com/color/512/microsoft-sql-server.png)                                                                                                | 30 KB | 512×512    | `skill-icons/sql-server.webp`  |

**Project icons** (resized to 256×256)

| File                                                  | Size   | Dimensions |
| ----------------------------------------------------- | ------ | ---------- |
| `projects/tour-de-france/Tour_de_France_logo.svg.png` | 256 KB | 3840×3840  |
| `projects/monitoring-four/FourIcone.ico`              | 200 KB | ICO        |
| `projects/cold lemonade/citron.png`                   | 179 KB | 708×708    |

**CV previews** (same size, WebP)

| File                         | Size   | Dimensions |
| ---------------------------- | ------ | ---------- |
| `curriculum-vitae/CV_FR.png` | 200 KB | 595×842    |
| `curriculum-vitae/CV_EN.png` | 192 KB | 595×842    |

**Done when.**

- Every file above is replaced, the database points to the new files, and every image on the site still loads.
- On `/skills` and `/projects/:url`, no skill icon is over 10 KB or comes from another host than Supabase.
- Lighthouse will still report "image delivery" savings on illustrations shown small (lists, carousel), because the dialog needs the 1600 px file. That's expected.

#### P1.2 Size, lazy-load and prioritise images in the templates

- [x] `project-item` (pinned projects, `/projects`): `ngSrc` with width/height (or `fill`), and `priority` on the first project
- [x] `project-item-condensed` (`/projects/archives`): `ngSrc`, lazy by default
- [x] `skills-recap` icons (`/skills`): `ngSrc` with width/height
- [x] `project-illustrations` carousel and `coworker-info` (`/projects/:url`): `ngSrc`, `priority` on the first illustration

**Done on 2026-11-03.** Every image uses `fill` in a sized container, because the database doesn't store image dimensions and the ratios vary: with `width`/`height`, `NgOptimizedImage` warns in dev mode whenever the rendered ratio differs from the file's, even with `object-fit`. The pinned project container got `aspect-ratio: 16 / 9` (the screenshots are 1.78–1.95) with `object-position: left`, the skill icons a 30×30 box, the coworker photos a 110×100 box. Screenshots before and after are identical on desktop and mobile. In dev mode, the priority images log NG02956 (no preconnect to Supabase) until the P3 preconnect is added.

**Problem.** These images are plain `<img [src]>` with no dimensions.

- All of them load immediately, even far below the fold.
- They cause layout shifts ("Media element lacking an explicit size").
- The LCP image is never given high fetch priority.

**Evidence.**

- `/projects`: LCP 3.7–4.1 s. The LCP element is the first pinned project's illustration in 2 of 3 runs. Lighthouse flags `fetchpriority=high should be applied`, the request not being discoverable in the HTML, and `unsized-images` (all 3 illustrations).
- `/projects/uloa`: LCP 4.8 s in all 3 runs. The LCP element is the first carousel illustration, with the same flags.

**Fix.** `NgOptimizedImage` handles lazy loading, `fetchpriority` and the size warnings. `CLAUDE.md` already asks for it on static images, and it works for these dynamic URLs too. Use `fill` plus a sized container when the aspect ratio varies.

**Files.**

- `src/app/projects/project-item/project-item.component.html`
- `src/app/projects/project-item/project-item-condensed/project-item-condensed.component.html`
- `src/app/skills/skills-recap/skills-recap.component.html`
- `src/app/projects/project-details/project-illustrations/project-illustrations.component.html`
- `src/app/projects/project-details/project-coworkers/coworker-info/coworker-info.component.html`

**Done when.** `unsized-images` passes, `lcp-discovery-insight` passes on `/projects` and `/projects/:url`, and `/projects/archives` only downloads the images in view and weighs under 1.5 MB. The "request is discoverable in the initial document" check of `lcp-discovery-insight` can't pass while the image URL comes from Supabase after startup (only P4 fixes that); the `fetchpriority=high` and "not lazy" checks should.

#### P1.3 Stop the home map from becoming the LCP element

- [x] Static map image (light + dark WebP in `public/map/`, same framing as zoom 6), displayed until Leaflet's first tiles are there
- [x] Load Leaflet on interaction (`@defer (on hover; on interaction)`), and start at zoom 6 without `flyTo`
- [x] Move `leaflet.css` out of the global `styles` in `angular.json` into the deferred `LeafletMapComponent`
- [x] While in this code: `updateTile()` adds a new tile layer on every theme change without removing the previous one

**Done on 2026-11-03.** `/` went from 0.82 to 0.89 on mobile (median of 3: 0.89, 0.92, 0.89), and LCP from 4.7 s to 3.5 s. The LCP element is the static map in all 3 runs, with no tile request and no Leaflet chunk before an interaction.

- The image isn't a `@placeholder`: Angular removes the placeholder as soon as the chunk is loaded, which would leave an empty tile until the tiles arrive. It stays on top of the map and fades out on the first tile layer's `load` event.
- A zoom requested before the tiles are there (a tap on mobile) is applied once they are, so its animation is visible.
- `leaflet.css` makes `leaflet-map.component.scss` exceed the 6 KB `anyComponentStyle` warning budget (11 KB, the error budget is 15 KB).

The images are displayed at exactly 400×200 CSS px and centred, so they line up with Leaflet's view at every tile size:

- `light-mode.webp` is the 400×200 view of zoom 6 centred on `[49.183, -0.372]`, drawn from the 4 OSM tiles of that view, so it's identical to what Leaflet shows. WebP quality 0.85.
- `dark-mode.webp` can't come from Stadia's tiles: its terms don't allow storing them without a paid plan. It's rendered once with MapLibre GL at `pixelRatio: 2` and zoom 5 (Leaflet's zoom minus 1) from the [OpenFreeMap](https://openfreemap.org/) `dark` style, recoloured with the colours of Stadia's tiles: land `#333333`, water `#222222`, parks `#383e36`, main roads `#505050` and thinner, labels `#a8a8a8`, no `place_state` labels, no maritime boundaries. WebP quality 0.8. The geography lines up with Stadia's tiles, but some labels differ.

**Problem.**

- `@defer (on viewport)` triggers immediately on mobile because the placeholder is already on screen.
- Leaflet then loads (150 KB uncompressed, 64% of it unused at load), and `zoomIn()` starts a 1 s `flyTo` from zoom 3 to zoom 6.
- That downloads tiles for every intermediate zoom: about 10 high-resolution PNGs, ~600 KB, from `tiles.stadiamaps.com`, which isn't preconnected (Lighthouse estimates 253 ms).
- A 256×256 tile is larger than the avatar (200×276), so the last tile painted becomes the LCP element.

**Evidence.**

- `/`: LCP 4.6–5.0 s.
- The LCP element is `img.leaflet-tile` in 2 of 3 runs. In the third, the tile had already been removed by Leaflet during the zoom, so Lighthouse couldn't point to it.
- During earlier test runs, when the tiles were slower to arrive, the avatar became the LCP element at 3.1 s.

**Fix.** A static image served from `public/` stays the LCP element and paints early. It has an alt text key in both `en.json` and `fr.json`. The zoom buttons weren't keyboard accessible: they are now native `<button>` elements with ARIA labels, and the focus moves to the remaining button when the pressed one disappears at the last zoom level. The credits required by the map licences, hidden until now, are displayed on the tile.

**Files.**

- `src/app/home/home.component.html`, `home.component.scss`
- `src/app/home/map/map.component.ts`, `map.component.html`, `map.component.scss`
- `src/app/home/map/leaflet-map/leaflet-map.component.ts`, `leaflet-map.component.scss`
- `public/map/`, `public/i18n/en.json`, `public/i18n/fr.json`
- `src/styles/dark-mode.scss`, `src/styles/light-mode.scss`
- `angular.json`

**Done when.** The LCP element on `/` is the static map or the avatar in all 3 runs, and no `tiles.stadiamaps.com` request happens without user interaction.

#### P1.4 Stop downloading data that is never shown

- [x] `AllComponent` (used on `/projects` **and** `/skills`): replace `getProjects()` with a count query
- [x] `countOngoingProjects()`: same, with a count query instead of `select('*')` then `.length`
- [x] `ArchivesService` keeps `getProjects()`, but with a request limited to the fields the archives use
- [x] `getSkills()` and `PROJECT_REQUEST`: request only the ids of a skill's projects, since they are only counted

**Done on 2026-11-04.** `/projects` and `/skills` now make no REST request over 4.2 KB. The scores stay within the usual ±0.05 variation and LCP doesn't move, so this step doesn't bring the 0.90 goal closer on its own.

| Page                 | REST weight     | Largest REST request | Mobile score | LCP         | TBT          |
| -------------------- | --------------- | -------------------- | ------------ | ----------- | ------------ |
| `/projects`          | 181.5 → 7.9 KB  | 174.0 → 3.5 KB       | 0.81 → 0.83  | 4.7 → 4.6 s | 155 → 109 ms |
| `/skills`            | 231.1 → 15.4 KB | 174.0 → 4.2 KB       | 0.86 → 0.85  | 3.9 → 3.9 s | 111 → 118 ms |
| `/projects/archives` | 199.2 → 19.4 KB | 174.0 → 8.4 KB       | 0.90 → 0.88  | 3.6 → 3.8 s | 53 → 105 ms  |
| `/projects/uloa`     | 13.2 → 5.8 KB   | 11.4 → 3.9 KB        | 0.81 → 0.81  | 4.6 → 4.6 s | 132 → 120 ms |

Median of 3 mobile runs, with the builds before and after the change alternating in the same session.

- `PROJECT_REQUEST` couldn't be trimmed as first planned, because the project details page needs it through `getProjectByUrl()`. `getProjects()` uses a new `ARCHIVED_PROJECT_REQUEST` and returns a new `ArchivedProject` type.
- `AllComponent.count` is a signal, and its text waits for the value: the tile used to say "NaN projects" until the data arrived.
- The project counts, status counts, skill, context and status filters and the text filter give the same results as the database.

**Problem.** `getProjects()` downloads the full project query (every project with translations, roles, illustrations, coworkers, context and skills with their projects). On `/projects` and `/skills`, that's done only to display `projects.length`.

**Evidence.**

- The `project?select=…` response is **175 KB**, the largest REST response on both `/projects` and `/skills`.
- The nested `project_skill → skill → projects:project(*)` repeats project rows inside every skill. Requesting only the ids takes that response from 177 to 65 KB, and the one on `/projects/uloa` from 10.7 to 3.1 KB.
- The `skill?select=…` response is 17.9 KB and is requested 3 times on `/skills`, also because of `projects:project(*)`. Requesting only the ids brings it down to 3.4 KB.

**Fix.** Use `.select('*', { count: 'exact', head: true })`, which returns only the count in a header. `countProjectsBySkill()` already uses this pattern.

**Files.**

- `src/app/shared/supabase.service.ts`
- `src/app/projects/all/all.component.ts`, `all.component.html`
- `src/app/projects/archives/archived-project.model.ts`, `archives.service.ts`, `status-filtering/status-filtering.component.ts`
- `src/app/projects/status/status.pipe.ts`
- `src/app/projects/project-item/project-item-condensed/project-item-condensed.component.ts`, `project-item-skill-list/project-item-skill-list.component.ts`
- `src/app/skills/skill.model.ts`

**Done when.** `/projects` and `/skills` make no REST request larger than ~10 KB.

#### P1.5 Load the CV preview only when the modal opens

- [x] Fetch the preview when the button is hovered, focused or clicked, not on component creation
- [x] Use the public URL in `<img>` instead of a downloaded blob, so the browser can cache it

**Done on 2026-11-04.** Neither page downloads the CV preview on load any more. The scores stay within the usual ±0.05 variation.

| Page          | Page weight  | CV preview     | Mobile score | LCP         | CLS           |
| ------------- | ------------ | -------------- | ------------ | ----------- | ------------- |
| `/`           | 431 → 354 KB | 78.5 KB → none | 0.92 → 0.93  | 3.4 → 3.2 s | 0.023 → 0.023 |
| `/experience` | 435 → 357 KB | 78.5 KB → none | 0.88 → 0.89  | 3.6 → 3.5 s | 0.080 → 0.081 |

Median of 3 mobile runs, with the builds before and after the change alternating in the same session. A server left running by mistake made the "before" build one commit older than intended (without P1.4), which doesn't change the requests of these two pages.

- **The 0.078 layout shift wasn't caused by this image**, as the first version of this report said. It's on `app-footer` in every run, with or without the change, and `#modal-container` is `position: fixed`, so its content can't move the footer. It's now part of P1.6.
- On desktop, the hover or focus usually gives the image time to load before the modal opens. On touch screens, loading starts with the tap.
- The modal has the preview's size from the start (595×842, at most 90% of the screen), and is a white sheet until the image arrives. `loading="eager"` makes the hover or focus download the image while the modal is still hidden.
- The public URL is served by the CDN with `public, max-age=2592000`. A `HEAD` request on it answers `private, no-cache`, but a real `GET` doesn't.
- The PDF download is unchanged: it still goes through `storage.download()` when the button is clicked.

**Problem.** `ResumeComponent` downloads `CV_FR.png` / `CV_EN.png` (**201 KB**, 72–80 KB since P1.1) as a blob through `storage.download()` on every visit to `/` and `/experience`, even if the modal is never opened.

**Evidence.** It's the heaviest request on `/` and `/experience`.

**Files.**

- `src/app/home/resume/resume.component.ts`, `resume.component.html`, `resume.component.scss`
- `src/app/shared/supabase.service.ts`

**Done when.** No `curriculum-vitae/` request happens before the button is hovered, focused or clicked.

#### P1.6 Remove the layout shifts caused by content arriving late

**Not done, by choice (2026-11-04).** CLS costs under 2 points on every page except `/experience` on desktop, which doesn't justify changing how short pages look or adding code to every page.

| Page                 | Mobile CLS | Points lost | Desktop CLS | Points lost |
| -------------------- | ---------- | ----------- | ----------- | ----------- |
| `/`                  | 0.023      | 0           | 0.002       | 0           |
| `/projects`          | 0.021      | 0           | 0.002       | 0           |
| `/projects/archives` | 0.053      | 0.5         | 0.056       | 0.5         |
| `/skills`            | 0.084      | 1.7         | 0.070       | 1.0         |
| `/experience`        | 0.081      | 1.5         | 0.589       | 22.3        |
| `/projects/uloa`     | 0.080      | 1.5         | 0.058       | 0.5         |

**Cause.** The first version of this section was wrong: grid rows have a fixed height, so the experience tiles can't resize them. A shift's score is the area that moved multiplied by the largest distance anything moved, and two things combine:

- **Distance:** the footer sits inside the viewport until the data arrives, then jumps out of it (about 1,600 px on `/experience`).
- **Area:** on desktop, the page starts overflowing at the same moment. The scrollbar appears, the page gets 15 px narrower, and the centred grid moves 7 px to the left. It's a small move, but it covers most of the screen.

**Tried and reverted.** Both brought CLS to at most 0.003 on every page:

- A `min-height: 100vh` wrapper around the navbar and the content, which left a gap above the footer and added a useless scrollbar on `/` and `/projects`.
- Hiding the footer until a page is displayed, with each long page reserving a screen's height while its data loads. The final layout was unchanged, but every long page needed a loading class on its host.

**If it matters later.** `scrollbar-gutter: stable` on `body` should remove the grid's move, and bring `/experience` on desktop to about 0.07. That's an estimate, it wasn't measured.

### P2: Less JavaScript on first load (helps every page)

**Result of P2.1, P2.2 and P2.4 (2026-11-04).** The initial bundle is 26% smaller and blocking time is down on every page. `/` is over the 0.90 goal, and `/projects` and `/projects/uloa` aren't: their LCP is an image, and that's what's left to improve.

| Step            | Initial total | Gzipped |
| --------------- | ------------- | ------- |
| Before P2       | 788 KB        | 207 KB  |
| P2.1            | 713 KB        | 189 KB  |
| P2.2            | 592 KB        | 163 KB  |
| Angular 22      | 612 KB        | 166 KB  |
| P2.4 (zoneless) | 573 KB        | 154 KB  |

| Page                 | Mobile score | LCP         | TBT          | Longest task |
| -------------------- | ------------ | ----------- | ------------ | ------------ |
| `/`                  | 0.91 → 0.94  | 3.3 → 3.0 s | 97 → 80 ms   | 148 → 130 ms |
| `/projects`          | 0.83 → 0.85  | 4.6 → 4.3 s | 111 → 77 ms  | 155 → 127 ms |
| `/projects/archives` | 0.93 → 1.00  | 3.2 → 0.6 s | 55 → 41 ms   | 151 → 132 ms |
| `/skills`            | 0.89 → 0.97  | 3.5 → 0.6 s | 81 → 45 ms   | 158 → 131 ms |
| `/experience`        | 0.88 → 0.98  | 3.6 → 0.6 s | 111 → 91 ms  | 161 → 141 ms |
| `/projects/uloa`     | 0.81 → 0.83  | 4.7 → 4.3 s | 138 → 100 ms | 153 → 130 ms |

Median of 3 mobile runs, with the builds from before P2.1 and after P2.4 alternating in the same session, both served without `ngsw-worker.js` (see section 2).

**The three LCPs of 0.6 s aren't real.** They're the simulation artefact described in section 2: the text now paints in the same frame as the first paint, so Lighthouse reports the simulated FCP. The one run that didn't flip gave `/experience` 0.92 with an LCP of 3.2 s, so expect those three pages around 0.90. The unthrottled paints barely move: first paint stays around 160 ms.

Before P2, the initial JavaScript was 759 KB uncompressed (790 KB with CSS, 208 KB gzipped). Main contents:

| Package                                                           | Size (uncompressed) | Needed on first load?                           |
| ----------------------------------------------------------------- | ------------------- | ----------------------------------------------- |
| `@angular/core`                                                   | 153 KB              | yes                                             |
| `@angular/cdk` (dialog, overlay, a11y, portal)                    | 75 KB               | **no**: only the project-details dialog uses it |
| `@angular/router`                                                 | 75 KB               | yes                                             |
| `@messageformat/core`                                             | 72 KB               | **no**: only 10 plural strings use it           |
| app code                                                          | 70 KB               | yes                                             |
| `@supabase/auth-js` + `realtime-js` + `storage-js` + `iceberg-js` | ~107 KB             | **no**: the app never logs in or uses realtime  |
| `@angular/common`                                                 | 42 KB               | yes                                             |
| `zone.js`                                                         | 34 KB               | **no**, if the app goes zoneless                |

On every page, Lighthouse also reported a ~150–160 ms long task attributed to `polyfills` (zone.js), which set the 150–160 ms "max potential FID", and about 60 KB of unused JavaScript.

#### P2.1 Move the dialog provider out of `app.config.ts`

- [x] Remove the `DEFAULT_DIALOG_CONFIG` provider, and pass the options in the only `dialog.open()` call

**Done on 2026-11-04.** `@angular/cdk` in the initial bundle goes from 75.4 KB to 2.2 KB. What's left is small helpers that `mat-icon` needs, so it can't reach zero while the navbar uses icons. A route provider wouldn't have worked: `app.routes.ts` is eager, so importing the token there would pull the CDK back in.

The provider replaced the CDK's defaults with a bare object. Without it, the dialog gets `role="dialog"` and closes when navigating. It would also focus its first control, but the arrows change the slide on any key press, so `autoFocus: 'dialog'` puts the focus on the dialog itself.

**Why.** Importing `DEFAULT_DIALOG_CONFIG` from `@angular/cdk/dialog` in `src/app/app.config.ts` is enough to pull the CDK dialog, overlay, a11y and portal code (~75 KB) into the initial bundle.

**Files.** `src/app/app.config.ts`, `src/app/projects/project-details/project-illustrations/project-illustrations.component.ts`

**Done when.** No `@angular/cdk` in the initial chunks, apart from what `mat-icon` needs. Check with `ng build --stats-json` and [esbuild's analyzer](https://esbuild.github.io/analyze/).

#### P2.2 Replace `supabase-js` with `postgrest-js`

- [x] Query tables with `@supabase/postgrest-js` (the same `.from().select()` API)
- [x] Build public storage URLs directly (`/storage/v1/object/public/portfolio-project/...`) instead of using `storage.download()`
- [x] The CV PDF download needs an equivalent: a public URL with `?download=<file name>`

**Done on 2026-11-04.** Of the 128 KB of `@supabase/*` in the initial bundle, only `postgrest-js` is left (14 KB), and the app no longer writes an auth key to `localStorage`. `<a download>` is ignored across origins, so the PDF link uses Supabase's `?download=` parameter, which sends it as an attachment with the right file name.

The text, images and links of 11 pages in both languages are identical to the previous build.

**Why.** The app only reads tables and public files, but `createClient()` ships the auth, realtime, storage and iceberg clients (~107 KB). The auth client also touches `localStorage` on startup.

**Files.** `src/app/shared/supabase.service.ts`, `src/app/home/resume/resume.component.ts`, `package.json`

#### P2.3 Drop `@messageformat/core`

- [ ] Replace `provideTranslocoMessageformat()` with a small custom `TranslocoTranspiler` built on `Intl.PluralRules`, handling only `{count, plural, =0 {...} =1 {...} other {# ...}}`
- [ ] Or split the 10 plural strings into separate keys

**Why.** 72 KB in `main.js` for 10 strings (`projects.*.count`, `achievements`, `years`, `months`, `days`, …).

**Files.** `src/app/app.config.ts`, `public/i18n/en.json`, `public/i18n/fr.json`

#### P2.4 Go zoneless

- [x] Upgrade to Angular 22 with `ng update`, along with `angular-eslint` 22 and TypeScript 6
- [x] Remove `provideZoneChangeDetection()`, `zone.js` from `polyfills` in `angular.json` (build and test), and the package. Zoneless is the default since Angular 21, so no provider is needed.
- [x] Convert state changed outside a component's own event handlers to signals:
  - `OngoingComponent.count`
  - `ProjectsComponent.pinnedProjects`
  - `SkillsComponent.sections`
  - `NavbarComponent.menuOpened`
  - `ThemeService.theme`
  - `currentSlide` in `ProjectCoworkersComponent` and `ProjectIllustrationsComponent`
  - `ProjectFilteringComponent.hasFilter`, instead of reading the form control in the template
- [x] Remove every `changeDetection` line. OnPush is the default in Angular 22, and `ng update` had stamped 51 components with `Eager` to keep the old behaviour.

**Done on 2026-11-04.** `polyfills-*.js` is gone and all pages still update. The `~155 ms` long task only shrinks to about 130 ms, so zone.js wasn't the whole of it.

**Checked against the Angular 21 build.**

- **Content:** the text, images and links of 11 pages in both languages are identical.
- **Layout:** footer position, page height and scrollbar are identical in 21 combinations of pages and screen sizes.
- **Behaviour:** 17 scenarios with real clicks, typing and scrolling give the same 209 values, with no errors: theme and language switches, carousels moving by themselves, the dialog, the archives filters, the mobile menu, the map and the CV.
- **Missed updates:** with `provideCheckNoChangesConfig({ exhaustive: true })` on during those scenarios, the only finding is `DurationPipe` returning a translation key while a language file loads. Nothing renders during that time, so it's harmless, and a comment on the pipe records that it relies on a `transloco` pipe in the same template.
- **Deployment:** a clean `npm install --legacy-peer-deps` and `npm run build`, as in the Dockerfile, both work. The Docker image itself wasn't built, and `ng test` has no spec files to run.

**Worth knowing.**

- `package-lock.json` is ignored, so deployments install the newest allowed versions: `postgrest-js` 2.119, not the 2.95 that `package.json` names. That's the version tested above.
- `ng update` added `withXhr()` to `provideHttpClient()` to keep the old backend. It's removed: only the translation files use `HttpClient`, and they work with the default `fetch` backend.
- The `onpush_zoneless_migration` MCP tool recommends adding the deprecated `ChangeDetectionStrategy.Default` with TODO comments, which doesn't fit Angular 22, so it wasn't followed.
- Two optional migrations weren't run: Karma to Vitest, and `@angular-devkit/build-angular` to the new builder.

**Why.** Removes 34 KB on every page, and reduces blocking time.

**Done when.** `polyfills-*.js` is gone from the build, and all pages still update after the data loads.

### P3: Small improvements

- [ ] **Preconnect to Supabase**, which every page uses (Lighthouse estimated 270–300 ms on `/projects` in some runs). Add `<link rel="preconnect" href="https://tgolpzoiiupkeshlgcpq.supabase.co" crossorigin>` in `src/index.html`.
- [ ] **Bundle the translation files.**
  - `TranslocoHttpLoader` fetches `/i18n/{lang}.json` only after `main.js` has run, and every translated text waits for it.
  - Two static JSON imports (~2 KB gzipped each) remove that round trip.
  - Files: `src/app/transloco-loader.ts`.
- [ ] **Register the service worker later.** Zoneless, `registerWhenStable` no longer waits for the Supabase data, so the worker takes control of every page about 120–460 ms after it starts, while its content is still loading, and it prefetches the app's files (`installMode: prefetch` in `ngsw-config.json`). It already did on most pages. What changes is `/skills`, where it used to wait more than 12 s, and `/projects/archives` (631 → 121 ms). `registerWithDelay` would avoid competing with the first load. The gain hasn't been measured.
- [ ] **Request the skills once on `/skills`.** `SkillsComponent`, `FavoritesComponent` and `KeepLearningComponent` each call `getSkills()` (3.4 KB per call since P1.4). Share one request between them.
- [ ] **Serve the navbar illustrations locally.** `projects.svg`, `skills.svg` and `experience.svg` are loaded from the Supabase bucket on every page. Move them to `public/` (file: `src/app/navbar/navbar.component.html`).
- [ ] **Apply the theme before first paint.**
  - `body` has `transition: background-color 0.3s` (`styles.scss`), and `ThemeService` sets the theme class after the app starts.
  - So the background animates from light to dark on load, and Lighthouse flags it as an animation the browser can't offload from the main thread.
  - Fix: set the class with a small inline script in `index.html` (reading `localStorage` / `prefers-color-scheme`), or enable the transition only after load.
- [ ] **Avatar preload on every route.** `index.html` preloads `photos/avatar-bust-arms-crossed.webp` with high priority on every page, not just `/`. It's small (6 KB), so leave it unless it competes with another page's LCP image.
- [ ] **Animations the browser can't offload** (informative): `box-shadow` pulse on `app-dot`, `border-radius` in `slideToLeft`, `background-color` in `g-grid-item-stagger`. Animating `transform` / `opacity` instead lets the browser do it off the main thread.
- [ ] **nginx cache for `public/`.** `nginx.conf` serves `public/` files (photos, illustrations, icons) with `no-cache`, so every visit revalidates them. A `max-age` of a few days for images is safe.
- [ ] **Production server.** Check that the VPS reverse proxy serves HTTP/2 (or HTTP/3) and that gzip (or brotli) is active end to end.

### P4: Prerendering (only if P1–P3 aren't enough)

- [ ] Evaluate build-time prerendering (`ng add @angular/ssr`, static output) for `/`, `/projects`, `/skills`, `/experience` and `/projects/:url` (`getPrerenderParams` listing project URLs)

**Why.** Today every page's content waits for HTML, then JavaScript, then startup, then Supabase, then rendering. Prerendering puts the content in the HTML that nginx already serves, with no Node server and the same Docker image layout.

**Trade-offs.**

- **Content updates:** changes in Supabase require a rebuild, triggered manually, on a schedule, or by a webhook to the GitHub Action.
- **Refetching:** `supabase-js` / `postgrest-js` use `fetch`, not `HttpClient`, so Angular's HTTP transfer cache won't reuse the build-time data. The browser would fetch everything again and re-render unless the state is transferred manually.
- **Browser-only code:** must be guarded. This covers `localStorage` / `matchMedia` in `ThemeService` and `LanguageService`, `ResumeComponent` moving its modal into `document.body`, and Leaflet.
- **Language:** the default language comes from `localStorage` on the client, so prerendered HTML is in one language. Visitors with the other language would see it switch, unless each language gets its own prerendered routes.
- **Theme:** the theme flash needs the inline script from P3.

**Docs.** [Rendering strategies](https://angular.dev/guide/routing/rendering-strategies), [build-time prerendering](https://angular.dev/guide/ssr#customizing-build-time-prerendering-ssg).

---

## 4. Page details

Reference data from the median mobile run of each page. Sizes are as transferred, compressed where the server compresses.

### Common to all pages

- **FCP:** 0.6 s on mobile, 0.2 s on desktop.
- **Initial JavaScript:** 790 KB uncompressed, 208 KB gzipped. About 60 KB of it is unused at load: 36 KB in the chunk holding the router and supabase-js, 25 KB in the one holding Angular core.
- **Long task:** about 150–170 ms, attributed to `polyfills` (zone.js), which gives "max potential FID" 150–160 ms (P2.4).
- **Icon font:** `display=block` hides the Material Symbols icons until the font loads (15–50 ms, informative).
- **Footer layout shift** on pages whose content comes from Supabase (P1.6).

### `/` (home)

- **Scores:** mobile 0.82 (runs 0.81, 0.82, 0.83), LCP 4.7 s, TBT 102 ms, CLS 0.023. Desktop 0.99.
- **LCP element:** a Leaflet map tile, `img.leaflet-tile` (P1.3).
- **Weight:** 1.2 MB in 55 requests.
  - CV preview `CV_FR.png`: 201 KB (P1.5)
  - About 10 Stadia Maps tiles of 37–83 KB each
  - Leaflet chunk: 44 KB, 28 KB of it unused at load
- **Supabase:** 12 REST requests (4 KB), 2 storage requests (201 KB).
- **Preconnect candidate:** `tiles.stadiamaps.com` (232 ms).
- **Layout shift:** 0.021, the footer moving when the avatar image renders.

### `/projects`

- **Scores:** mobile 0.88 (runs 0.86, 0.88, 0.89), LCP 3.8 s, TBT 106 ms, CLS 0.021. Desktop 1.00.
- **LCP element:** the first pinned project's illustration (2 of 3 runs) or its description text (P1.1, P1.2).
- **Weight:** 1.4 MB in 43 requests.
  - `vue_leaflet_laigle.png`: 674 KB
  - `project?select=…`: 176 KB, used only for a count (P1.4)
  - `mes_infos_tracability.png`: 147 KB
  - `maquette_uloa_notifications.png`: 71 KB
- **Image savings:** 858 KB. All 3 illustrations are unsized.

### `/projects/archives`

- **Scores:** mobile 0.88 (runs 0.88, 0.88, 0.88), LCP 3.8 s, TBT 121 ms, CLS 0.052. Desktop 0.99 (CLS 0.056).
- **LCP element:** the page description text (`app-skill-section-description p`).
- **Weight:** 10.2 MB in 57 requests. The 19 project illustrations account for 9.7 MB, all loaded at once (P1.1, P1.2). Image savings: 9.6 MB.
- **Main thread:** 2.5 s of work, the highest of all pages.
- **Layout shift:** 0.046 on the footer (P1.6).

### `/skills`

- **Scores:** mobile 0.85 (runs 0.84, 0.85, 0.87), LCP 4.1 s, TBT 59 ms, CLS 0.084 (0.107 in one run). Desktop 0.99 (CLS 0.070).
- **LCP element:** the text of the "Keep learning" tile.
- **Weight:** 3.7 MB in 90 requests.
  - 26 skill icons: 2.7 MB. The largest are `angular.png` (390 KB), `osm.png` (257 KB) and `php.png` (170 KB). P1.1, P1.2.
  - `project?select=…`: 175 KB, from `AllComponent`'s count (P1.4)
- **Layout shift:** 0.078 on the footer (P1.6).

### `/experience`

- **Scores:** mobile 0.90 (runs 0.89, 0.90, 0.90), LCP 3.4 s, TBT 103 ms, CLS 0.080. **Desktop 0.77**, because of CLS 0.589.
- **LCP element:** the "Curriculum Vitae" heading of the resume tile.
- **Weight:** 558 KB in 44 requests. The heaviest request is `CV_FR.png` (201 KB), loaded without the modal being opened (P1.5).
- **Layout shifts:**
  - Mobile: 0.078 on the footer (P1.6).
  - Desktop: 0.587, the grid moving 7 px when the scrollbar appears, combined with the footer's jump (P1.6).

### `/projects/uloa` (project details)

- **Scores:** mobile 0.79 (runs 0.79, 0.79, 0.80), LCP 4.8 s, TBT 152 ms, CLS 0.081. Desktop 0.99.
- **LCP element:** the first carousel illustration, `maquette_uloa_notifications.png` (70 KB). P1.2.
- **Weight:** 1.5 MB in 50 requests.
  - Skill icons: `angular.png` 390 KB, `netcore.png` 108 KB, `csharp.png` 107 KB, `html.png` 97 KB
  - Other illustrations, e.g. `maquette_uloa_preferences.png` (91 KB)
- **Externally hosted icons:** `upload.wikimedia.org` and `cdn-icons-png.flaticon.com` are preconnect candidates (348 ms and 331 ms). The flaticon icon is 512×512 displayed at 53×53 (P1.1).
- **Layout shift:** 0.078 on the footer (P1.6).

---

## 5. Appendix

### Noticed in passing (not performance)

- `<html lang="en">` is static in `src/index.html`, but the default UI language is French (`LanguageService` falls back to `'fr'`). That breaks WCAG 3.1.1 (Language of Page): update `document.documentElement.lang` when the language changes.
- On a page that overflows by little, scrolling returns to the top: the navbar shrinks by 40 px when it sticks, which takes 40 px off the scroll position. At 860 px tall, `/` overflows by 28 px and can't stay scrolled. At 768 px tall, a scroll of about 30 px or less returns to the top.
- The CV preview is stretched in its modal on screens under about 936 px tall: 338×731 instead of 338×478 on a phone, and 595×691 instead of 488×691 at 1366×768. The `<img>` has `width="595" height="842"`, and `max-width` and `max-height` each clamp one side. Adding `width: auto; height: auto` to `.modal-img` gives the right ratio.
- `app-action-button` isn't keyboard accessible: it's a plain element with a click listener and no focus, so the dialog can't be opened from the keyboard, and neither can the CV be downloaded.
- 10 components are never rendered, so the compiler doesn't even see them: `ProjectSkillsComponent`, the tooltip, the chips, `InputComponent` and the skill highlight placeholder. They weren't migrated: the tooltip, for one, would need signals to work now.
- The CV modal can't be closed from the keyboard: only a mouse press or tap outside it closes it. It also has no `role="dialog"`, and focus stays on the page behind it, short of the focus management `CLAUDE.md` requires.
- The archives' text filter searches `project.description` and `project_context.label`, which hold translation keys (`project.description.chifoumi`, `context.label.insa`), not the displayed text. "description", "context" or "label" match all 26 projects, and a word from a displayed description ("traçabilité", "multijoueur") matches none.
- `coworker.avatar_head` isn't used by the app, and some of its values are wrong: Zacharia's is a LinkedIn URL, Nathan's points to `head_jerome-saivres.png`, and Jérôme's to his bust photo.

### Raw data

The JSON reports of this inspection were saved in a temporary session folder and won't be kept. Re-run the command from section 2 to regenerate them; `--view` opens the HTML report.

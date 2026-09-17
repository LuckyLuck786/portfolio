import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import App from "./App";
import { PROJECTS } from "./components/Projects";
import { HOME_META, projectMeta, renderHead, SITE_URL } from "./lib/seo";

/* Build-time only: scripts/prerender.mjs renders each route to static HTML
   so crawlers and link-preview bots (which don't run JavaScript) see the
   real content and per-page meta tags. */

export const pages = [HOME_META, ...PROJECTS.map(projectMeta)];

/** Plain project data for scripts/og-images.mjs. */
export const projectCards = PROJECTS.map(({ slug, index, title, kicker, summary, tags }) => ({
  slug,
  index,
  title,
  kicker,
  summary,
  tags,
}));

export { renderHead, SITE_URL };

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

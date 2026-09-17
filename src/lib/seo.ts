import { useEffect } from "react";

export const SITE_URL = "https://shaikluqman.vercel.app";

const PERSON_NAME = "Shaik Luqman";

export type PageMeta = {
  /** Route path, e.g. "/" or "/projects/metroflow". */
  path: string;
  title: string;
  description: string;
  /** Absolute path of the 1200×630 share image under public/. */
  image: string;
  imageAlt: string;
  type: "website" | "article";
  jsonLd: object[];
};

const PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: PERSON_NAME,
  url: `${SITE_URL}/`,
  jobTitle: "Full-Stack & Applied-AI Engineer",
  description:
    "Full-stack developer crafting clean, intuitive web experiences — built to last.",
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  affiliation: [
    {
      "@type": "CollegeOrUniversity",
      name: "Dayananda Sagar Academy of Technology and Management",
      alternateName: "DSATM",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Indian Institute of Technology Madras",
      alternateName: "IIT Madras",
    },
  ],
  knowsAbout: [
    "Full-stack development",
    "React",
    "TypeScript",
    "Node.js",
    "Django REST Framework",
    "Spring Boot",
    "MySQL",
    "Retrieval-augmented generation",
    "LLM orchestration",
    "Reinforcement learning",
    "JWT authentication",
    "Role-based access control",
    "Linux",
    "Docker",
  ],
  sameAs: ["https://github.com/LuckyLuck786", "https://linkedin.com/in/luqman-shaik"],
};

export const HOME_META: PageMeta = {
  path: "/",
  title: "Shaik Luqman — Full-Stack & Applied-AI Engineer",
  description:
    "Shaik Luqman — full-stack & applied-AI engineer in Bengaluru. CSE at DSATM and BS in Data Science & Applications at IIT Madras. Projects: MetroFlow, Suraksha.",
  image: "/og.png",
  imageAlt: "Shaik Luqman — I Build Things. Still learning how to build them right.",
  type: "website",
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: `${SITE_URL}/`,
      name: "Shaik Luqman — Portfolio",
      mainEntity: PERSON,
    },
  ],
};

type ProjectSeoInput = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  tags: string[];
};

export function projectMeta(project: ProjectSeoInput): PageMeta {
  const path = `/projects/${project.slug}`;
  return {
    path,
    title: `${project.title} — ${project.kicker} · Shaik Luqman`,
    description: project.summary,
    image: `/og-${project.slug}.png`,
    imageAlt: `${project.title} — ${project.kicker}. Case study by Shaik Luqman.`,
    type: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        headline: `${project.title} — ${project.kicker}`,
        description: project.summary,
        url: `${SITE_URL}${path}`,
        keywords: project.tags.join(", "),
        author: { "@id": `${SITE_URL}/#person`, "@type": "Person", name: PERSON_NAME, url: `${SITE_URL}/` },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/#projects` },
          { "@type": "ListItem", position: 3, name: project.title, item: `${SITE_URL}${path}` },
        ],
      },
    ],
  };
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** The per-page <head> tags; the build-time prerender writes these into each HTML file. */
export function renderHead(meta: PageMeta) {
  const url = `${SITE_URL}${meta.path}`;
  const image = `${SITE_URL}${meta.image}`;
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);
  const imageAlt = escapeAttr(meta.imageAlt);
  /* "<" is escaped so JSON-LD can never close its own script tag. */
  const jsonLd = meta.jsonLd
    .map(
      (block) =>
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, "\\u003c")}</script>`,
    )
    .join("\n    ");

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${PERSON_NAME}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    jsonLd,
  ].join("\n    ");
}

/** Keeps the tab title and description in sync during client-side navigation. */
export function useDocumentMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `${SITE_URL}${meta.path}`);
  }, [meta.title, meta.description, meta.path]);
}

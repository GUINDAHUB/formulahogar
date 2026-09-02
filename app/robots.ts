import type { MetadataRoute } from "next";

const BASE_URL = "https://formulahogar.com";

// Rutas de proceso sin valor de búsqueda: fuera del crawl.
const DISALLOW = ["/api/", "/gracias", "/formulario-viabilidad", "/documentacion"];

// Crawlers de motores generativos (GEO): les damos acceso explícito para que
// ChatGPT, Claude, Perplexity, Gemini y compañía puedan leernos y citarnos.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

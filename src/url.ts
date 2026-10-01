// Interne links altijd via url(): op GitHub Pages staat de proefversie in een submap
// (deventually.github.io/clarissa), op het eigen domein in de root. De submap komt uit `base`
// in astro.config.mjs, en die zet de deploy-workflow via BASE_PATH.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (path: string) => base + path;

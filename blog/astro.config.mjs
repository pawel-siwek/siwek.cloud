// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The blog is built into ../dist/blog and deployed together with the static
// site from ../public (see .github/workflows/swa.yml).
export default defineConfig({
  site: 'https://siwek.cloud',
  base: '/blog',
  outDir: '../dist/blog',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed' },
  },
});

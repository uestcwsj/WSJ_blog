import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://uestcwsj.github.io';
const base = '/WSJ_blog';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [sitemap()],
});

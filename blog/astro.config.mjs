// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? 'https://blog.hirovodka.com';

export default defineConfig({
	site,
	trailingSlash: 'always',
	integrations: [mdx(), sitemap()],
});

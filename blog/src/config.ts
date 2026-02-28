import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "HiroVodka Blog",
	subtitle: "Web開発のメモとノート",
	lang: "ja",
	themeColor: {
		hue: 215,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "assets/images/demo-banner.png",
		position: "center 80%",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [
		{
			src: "/favicon/favicon-light-32.png",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-light-180.png",
			sizes: "180x180",
		},
		{
			src: "/favicon/favicon-light-192.png",
			sizes: "192x192",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "About",
			url: "https://hirovodka.com",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/images/blog-placeholder-about.jpg",
	name: "Hiro",
	bio: "Webエンジニア / Technical Writer。TypeScriptとAstro中心に検証しています。",
	links: [
		{
			name: "X (Twitter)",
			icon: "fa6-brands:x-twitter",
			url: "https://x.com/hirovodka",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/hirovodka",
		},
		{
			name: "Zenn",
			icon: "fa6-solid:book",
			url: "https://zenn.dev/hirovodka",
		},
		{
			name: "LinkedIn",
			icon: "fa6-brands:linkedin",
			url: "https://www.linkedin.com/in/hirovodka",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "",
	url: "",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

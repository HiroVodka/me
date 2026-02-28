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
	avatar: "/pro.JPG",
	name: "HiroVodka",
	role: "Web Engineer",
	bio: "2020年にバックエンドエンジニアとしてキャリアを開始。2022年に株式会社マネーフォワードへ入社後は、共通DB依存の解消を中心に技術的負債の解消を主導し、その後は契約基盤プロダクトでAPIのマイクロサービス化、バッチ性能改善、SRE施策（SLO導入・運用改善）を推進してきました。現在はチームリーダーとして技術的意思決定と横断調整に加え、チーム内へのSRE推進とメンター業務を担当しています。",
	stacks: [
		"Ruby",
		"Ruby on Rails",
		"Go",
		"AWS",
		"MySQL",
		"Kubernetes",
		"SRE",
		"Datadog",
	],
	links: [
		{
			name: "X (Twitter)",
			icon: "fa6-brands:x-twitter",
			url: "https://x.com/_HiroVodka_",
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
			url: "https://www.linkedin.com/in/滉人-伊丹-535501234",
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

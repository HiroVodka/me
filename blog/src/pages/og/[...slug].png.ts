import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import sharp from "sharp";
import { profileConfig, siteConfig } from "@/config";

export const prerender = true;

const WIDTH = 1200;
const HEIGHT = 630;
const TITLE_LINE_LENGTH = 24;
const TITLE_MAX_LINES = 3;
const DESCRIPTION_LINE_LENGTH = 46;
const DESCRIPTION_MAX_LINES = 2;

type OgProps = {
	title: string;
	description: string;
};

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function wrapLines(
	value: string,
	lineLength: number,
	maxLines: number,
): string[] {
	const normalized = value.replace(/\s+/g, " ").trim();
	if (!normalized) {
		return [];
	}

	const chars = Array.from(normalized);
	const lines: string[] = [];

	for (
		let i = 0;
		i < chars.length && lines.length < maxLines;
		i += lineLength
	) {
		lines.push(chars.slice(i, i + lineLength).join(""));
	}

	if (chars.length > lineLength * maxLines && lines.length > 0) {
		const lastLineChars = Array.from(lines[lines.length - 1]);
		if (lastLineChars.length > 0) {
			lastLineChars[lastLineChars.length - 1] = "…";
		}
		lines[lines.length - 1] = lastLineChars.join("");
	}

	return lines;
}

export async function getStaticPaths() {
	const posts = await getCollection("posts", ({ data }) => !data.draft);
	return posts.map((entry) => ({
		params: { slug: entry.slug },
		props: {
			title: entry.data.title,
			description: entry.data.description || siteConfig.subtitle,
		} satisfies OgProps,
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const ogProps = props as OgProps;
	const titleLines = wrapLines(
		ogProps.title,
		TITLE_LINE_LENGTH,
		TITLE_MAX_LINES,
	).map(escapeXml);
	const descriptionLines = wrapLines(
		ogProps.description || siteConfig.subtitle,
		DESCRIPTION_LINE_LENGTH,
		DESCRIPTION_MAX_LINES,
	).map(escapeXml);
	const author = escapeXml(profileConfig.name);
	const siteTitle = escapeXml(siteConfig.title);
	const titleText = titleLines
		.map((line, index) =>
			index === 0
				? `<tspan x="96" dy="0">${line}</tspan>`
				: `<tspan x="96" dy="74">${line}</tspan>`,
		)
		.join("");
	const descriptionText = descriptionLines
		.map((line, index) =>
			index === 0
				? `<tspan x="96" dy="0">${line}</tspan>`
				: `<tspan x="96" dy="42">${line}</tspan>`,
		)
		.join("");

	const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#111827"/>
      <stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="32" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
  <rect x="96" y="96" width="280" height="10" rx="5" fill="url(#accent)"/>
  <text x="96" y="176" fill="#e2e8f0" font-size="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">${siteTitle}</text>
  <text x="96" y="270" fill="#f8fafc" font-size="64" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">${titleText}</text>
  <text x="96" y="470" fill="#cbd5e1" font-size="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">${descriptionText}</text>
  <text x="96" y="586" fill="#93c5fd" font-size="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">by ${author}</text>
</svg>
`.trim();

	const png = await sharp(Buffer.from(svg))
		.png({
			compressionLevel: 9,
			quality: 90,
		})
		.toBuffer();

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};

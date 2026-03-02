import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import sharp from "sharp";

export const prerender = true;

const WIDTH = 1200;
const HEIGHT = 630;
// 15 full-width chars ~= 30 visual units.
const TITLE_LINE_UNITS = 30;
const TITLE_MAX_LINES = 3;

type OgProps = {
	title: string;
};

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function getCharUnits(char: string): number {
	// CJK, full-width symbols and emoji occupy more horizontal space.
	if (
		/[\u1100-\u115f\u2329\u232a\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe19\ufe30-\ufe6f\uff01-\uff60\uffe0-\uffe6]/u.test(
			char,
		) ||
		/\p{Extended_Pictographic}/u.test(char)
	) {
		return 2;
	}
	return 1;
}

function trimToUnitsWithEllipsis(value: string, maxUnits: number): string {
	const chars = Array.from(value);
	let units = 0;
	let out = "";

	for (const char of chars) {
		const next = getCharUnits(char);
		if (units + next > maxUnits - 1) {
			break;
		}
		out += char;
		units += next;
	}

	return out.trimEnd() + "…";
}

function wrapLines(value: string, lineUnits: number, maxLines: number): string[] {
	const normalized = value.replace(/\s+/g, " ").trim();
	if (!normalized) {
		return [];
	}

	const chars = Array.from(normalized);
	const lines: string[] = [];
	let current = "";
	let currentUnits = 0;

	for (const char of chars) {
		const nextUnits = getCharUnits(char);
		if (current && currentUnits + nextUnits > lineUnits) {
			lines.push(current);
			current = char;
			currentUnits = nextUnits;
			if (lines.length === maxLines) {
				break;
			}
			continue;
		}
		current += char;
		currentUnits += nextUnits;
	}

	if (lines.length < maxLines && current) {
		lines.push(current);
	}

	const usedLength = lines.join("").length;
	const wasTruncated = usedLength < chars.length;
	if (wasTruncated && lines.length > 0) {
		lines[lines.length - 1] = trimToUnitsWithEllipsis(
			lines[lines.length - 1],
			lineUnits,
		);
	}

	return lines;
}

export async function getStaticPaths() {
	const posts = await getCollection("posts", ({ data }) => !data.draft);
	return posts.map((entry) => ({
		params: { slug: entry.slug },
		props: {
			title: entry.data.title,
		} satisfies OgProps,
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const ogProps = props as OgProps;
	const titleLines = wrapLines(
		ogProps.title,
		TITLE_LINE_UNITS,
		TITLE_MAX_LINES,
	).map(escapeXml);
	const titleText = titleLines
		.map((line, index) =>
			index === 0
				? `<tspan x="96" dy="0">${line}</tspan>`
				: `<tspan x="96" dy="82">${line}</tspan>`,
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
  <text x="96" y="250" fill="#f8fafc" font-size="68" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">${titleText}</text>
</svg>
`.trim();

	const png = await sharp(Buffer.from(svg))
		.png({
			compressionLevel: 9,
			quality: 90,
		})
		.toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};

import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

type SearchItem = {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
};

const MAX_RESULTS = 20;

function escapeHtml(input: string): string {
	return input
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function stripToText(input: string): string {
	return input
		.replace(/<[^>]+>/g, " ")
		.replace(/[`*_#>[\]()!~|]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function countOccurrences(haystack: string, needle: string): number {
	if (!needle) return 0;
	return haystack.split(needle).length - 1;
}

function buildExcerpt(text: string, keyword: string): string {
	const plain = stripToText(text);
	if (!plain) return "";

	const normalized = plain.toLowerCase();
	const idx = normalized.indexOf(keyword);
	const start = Math.max(0, idx - 50);
	const end = Math.min(plain.length, idx + 110);
	const snippet = plain.slice(start, end).trim();
	const escaped = escapeHtml(snippet);
	return escaped.replace(
		new RegExp(
			escapeHtml(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
			"gi",
		),
		"<mark>$&</mark>",
	);
}

export const GET: APIRoute = async ({ request }) => {
	const reqUrl = new URL(request.url);
	const rawQuery = reqUrl.searchParams.get("q")?.trim() ?? "";
	const query = rawQuery.toLowerCase();

	if (!query) {
		return new Response(JSON.stringify([]), {
			headers: {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store",
			},
		});
	}

	const posts = await getCollection("posts", ({ data }) => data.draft !== true);

	const results = posts
		.map((post) => {
			const title = post.data.title ?? "";
			const description = post.data.description ?? "";
			const tags = Array.isArray(post.data.tags)
				? post.data.tags.join(" ")
				: "";
			const category = post.data.category ?? "";
			const bodyText = stripToText(post.body ?? "");

			const titleLower = title.toLowerCase();
			const descLower = description.toLowerCase();
			const tagsLower = tags.toLowerCase();
			const categoryLower = category.toLowerCase();
			const bodyLower = bodyText.toLowerCase();

			const score =
				countOccurrences(titleLower, query) * 8 +
				countOccurrences(descLower, query) * 5 +
				countOccurrences(tagsLower, query) * 4 +
				countOccurrences(categoryLower, query) * 3 +
				countOccurrences(bodyLower, query);

			return {
				score,
				publishedAt: new Date(post.data.published).getTime(),
				item: {
					url: `/posts/${post.slug}/`,
					meta: { title: post.data.title },
					excerpt: buildExcerpt(
						post.body ?? post.data.description ?? "",
						query,
					),
				} satisfies SearchItem,
			};
		})
		.filter((entry) => entry.score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.publishedAt - a.publishedAt;
		})
		.slice(0, MAX_RESULTS)
		.map((entry) => entry.item);

	return new Response(JSON.stringify(results), {
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
		},
	});
};

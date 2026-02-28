export function getTwemojiUrl(emoji: string): string {
	const codePoints = Array.from(emoji.trim())
		.map((char) => char.codePointAt(0))
		.filter((codePoint): codePoint is number => codePoint !== undefined && codePoint !== 0xfe0f)
		.map((codePoint) => codePoint.toString(16));

	if (codePoints.length === 0) {
		return "";
	}

	return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${codePoints.join("-")}.png`;
}

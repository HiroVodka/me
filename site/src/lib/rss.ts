export type RssItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

const readTag = (xml: string, tag: string): string => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return (match?.[1] ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
};

const readLink = (xml: string): string => {
  const inline = readTag(xml, 'link');
  if (inline) return inline;

  const hrefMatch = xml.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i);
  return (hrefMatch?.[1] ?? '').trim();
};

const readDate = (xml: string): string =>
  readTag(xml, 'pubDate') ||
  readTag(xml, 'dc:date') ||
  readTag(xml, 'published') ||
  readTag(xml, 'updated');

const parseItems = (xml: string, source: string): RssItem[] => {
  const chunks = [
    ...(xml.match(/<item[\s\S]*?<\/item>/gi) ?? []),
    ...(xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? []),
  ];

  return chunks
    .map((itemXml) => ({
      title: readTag(itemXml, 'title'),
      link: readLink(itemXml),
      pubDate: readDate(itemXml),
      source,
    }))
    .filter((item) => item.title && item.link);
};

export const fetchRss = async (url: string, source: string): Promise<RssItem[]> => {
  const response = await fetch(url, { headers: { 'user-agent': 'hirovodka-site-build' } });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${source}: ${response.status}`);
  }

  return parseItems(await response.text(), source);
};

export const sortByDate = (items: RssItem[]): RssItem[] =>
  [...items].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

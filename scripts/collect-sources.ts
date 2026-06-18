import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'config', 'briefbeacon.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

interface SourceItem {
  title: string;
  url: string;
  source: string;
  snippet: string;
}

async function fetchRSS(url: string): Promise<SourceItem[]> {
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    const items: SourceItem[] = [];
    const titleRegex = /<title>([^<]+)<\/title>/g;
    const linkRegex = /<link>([^<]+)<\/link>/g;
    const descRegex = /<description>([^<]+)<\/description>/g;
    const titles = [...text.matchAll(titleRegex)].slice(1);
    const links = [...text.matchAll(linkRegex)].slice(1);
    const descs = [...text.matchAll(descRegex)].slice(1);

    for (let i = 0; i < Math.min(titles.length, 5); i++) {
      items.push({
        title: titles[i]?.[1]?.trim() ?? 'Untitled',
        url: links[i]?.[1]?.trim() ?? '',
        source: url,
        snippet: descs[i]?.[1]?.trim()?.slice(0, 200) ?? '',
      });
    }

    return items;
  } catch (err) {
    console.warn(`Failed to fetch RSS ${url}:`, err);
    return [];
  }
}

async function collectSources(): Promise<SourceItem[]> {
  const allItems: SourceItem[] = [];

  for (const url of config.sources.rss) {
    const items = await fetchRSS(url);
    allItems.push(...items);
    console.log(`Collected ${items.length} items from ${url}`);
  }

  return allItems;
}

export { collectSources };
export type { SourceItem };

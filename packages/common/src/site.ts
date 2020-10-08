import fetch from 'node-fetch';
import { URL } from 'url';

export type SiteId = 'kukulu' | 'mildom' | 'openrec' | 'twitch' | 'youtube';

const names: { [P in SiteId]: string } & {
  [key: string]: string | undefined;
} = {
  kukulu: 'kukuluLive',
  mildom: 'Mildom',
  openrec: 'OPENREC.tv',
  twitch: 'Twitch',
  youtube: 'YouTube',
};

const homeUrls: { [P in SiteId]: string } & {
  [key: string]: string | undefined;
} = {
  kukulu: 'https://live.erinn.biz/',
  mildom: 'https://www.mildom.com/',
  openrec: 'https://www.openrec.tv/',
  twitch: 'https://www.twitch.tv/',
  youtube: 'https://www.youtube.com/',
};

const thumbnailUrlPrefixes: { [P in SiteId]: string } = {
  kukulu: 'https://live.erinn.biz/',
  mildom: 'https://lh3.googleusercontent.com/',
  openrec: 'https://hayabusa.io/openrec-image/thumbnails/',
  twitch: 'https://static-cdn.jtvnw.net/previews-ttv/',
  youtube: 'https://i.ytimg.com/vi/',
};

export const getSiteName = (site: string) => {
  const name = names[site];
  if (!name) {
    throw new Error(`Unknown site :${site}`);
  }
  return name;
};

export const fetchFaviconUrl = (site: string) => {
  const url = homeUrls[site];
  if (!url) {
    throw new Error(`Unknown site: ${site}`);
  }
  return fetchFaviconUrlImpl(url);
};

const linkRegex = /<link (?:[^>]*?)rel="(?:[^"]* )?icon(?: [^"]*)?"(?:[^>]*?)>/;
const hrefRegex = / href="([^"]+)"/;

async function fetchFaviconUrlImpl(url: string) {
  const html = await fetch(url).then((res) => res.text());
  const linkTag = linkRegex.exec(html)?.[0];
  if (linkTag) {
    const faviconUrl = hrefRegex.exec(linkTag)?.[1];
    if (faviconUrl) {
      return new URL(faviconUrl, url).href;
    }
  }
  return new URL('/favicon.ico', url).href;
}

export const verifyThumbnailUrl = (url: string) => {
  for (const prefix of Object.values(thumbnailUrlPrefixes)) {
    if (url.startsWith(prefix)) {
      return true;
    }
  }
  return false;
};

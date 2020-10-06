export type SiteId = 'kukulu' | 'mildom' | 'openrec' | 'twitch' | 'youtube';

const names: { [P in SiteId]: string } = {
  kukulu: 'kukuluLive',
  mildom: 'Mildom',
  openrec: 'OPENREC.tv',
  twitch: 'Twitch',
  youtube: 'YouTube',
};

export const getSiteName = (site: SiteId) => names[site];

export const getFaviconCache = (site: SiteId) => `/favicons/${site}.ico`;

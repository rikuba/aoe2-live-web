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

export const getSiteName = (site: string) => {
  const name = names[site];
  if (!name) {
    throw new Error(`Unknown site :${site}`);
  }
  return name;
};

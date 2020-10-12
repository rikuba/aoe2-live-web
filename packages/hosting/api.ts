import { Channel, SiteId } from '@aoe2-live/common';

const API_BASE = 'https://aoe2.live/api';
const CACHE_BASE = 'https://storage.googleapis.com/aoe2-live-cache';

const json = (url: string) => fetch(url).then((res) => res.json());

export const channels = () =>
  json(`${API_BASE}/channels`) as Promise<Channel[]>;

export const favicon = (site: SiteId) => `${CACHE_BASE}/favicon.${site}.png`;

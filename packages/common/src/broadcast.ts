import { SiteId } from './site';

type BroadcastBase = {
  streamId: string;
  site: SiteId;
  status: 'live' | 'ended' | 'upcoming' | 'deleted';
  userId: string | null;
  channelId: string;
  channelName: string;
  startTime: number;
  endTime: number | null;
  game: string | null;
  title: string;
  url: string;
  thumbnail: string;
  viewers: number | null;
  maxViewers: number | null;
};

export type LiveBroadcast = BroadcastBase & {
  status: 'live';
  endTime: null;
};

export type EndedBroadcast = BroadcastBase & {
  status: 'ended';
  endTime: number;
};

export type UpcomingBroadcast = BroadcastBase & {
  status: 'upcoming';
  endTime: null;
};

export type DeletedBroadcast = BroadcastBase & {
  status: 'deleted';
};

export type Broadcast =
  | LiveBroadcast
  | EndedBroadcast
  | UpcomingBroadcast
  | DeletedBroadcast;

export function getVideoUrl(stream: Broadcast): string | null {
  switch (stream.site) {
    case 'kukulu':
    case 'youtube':
      return stream.url;
    case 'mildom':
    case 'openrec':
    case 'twitch':
      return null;
    default: {
      const exhaustiveCheck: never = stream.site;
      throw new Error(`Unknown site: ${exhaustiveCheck}`);
    }
  }
}

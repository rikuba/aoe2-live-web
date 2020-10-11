import { Broadcast } from './broadcast';
import { SiteId } from './site';

export type StreamGroup = {
  userId: string | null;
  streams: Broadcast[];
  totalViewers: number;
};

export function groupStreamsByUser(streams: Broadcast[]) {
  return streams.reduce<StreamGroup[]>((groups, stream) => {
    const { userId } = stream;
    if (userId) {
      const i = groups.findIndex((g) => g.userId === userId);
      if (i >= 0) {
        return [
          ...groups.slice(0, i),
          addStreamToGroup(groups[i], stream),
          ...groups.slice(i + 1),
        ];
      }
    }
    return groups.concat({
      userId: userId,
      streams: [stream],
      totalViewers: stream.viewers ?? 0,
    });
  }, []);
}

function addStreamToGroup(group: StreamGroup, stream: Broadcast): StreamGroup {
  return {
    ...group,
    streams: group.streams.concat(stream).sort(compareSite),
    totalViewers: group.totalViewers + (stream.viewers ?? 0),
  };
}

const siteOrder: SiteId[] = [
  'kukulu',
  'youtube',
  'twitch',
  'mildom',
  'openrec',
];

function compareSite(a: Broadcast, b: Broadcast) {
  return siteOrder.indexOf(a.site) - siteOrder.indexOf(b.site);
}

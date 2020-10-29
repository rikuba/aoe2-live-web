import { SiteId } from './site';

export type Channel = {
  channelId: string;
  site: SiteId;
  userId: string;
};

export function getChannelUrl(channel: {
  channelId: string;
  site: SiteId;
}): string {
  switch (channel.site) {
    case 'kukulu':
      return `https://live.erinn.biz/userdata.php?uid://${channel.channelId}/`;
    case 'mildom':
      return `https://www.mildom.com/profile/${channel.channelId}`;
    case 'openrec':
      return `https://www.openrec.tv/user/${channel.channelId}`;
    case 'twitch':
      return `https://www.twitch.tv/${channel.channelId}`;
    case 'youtube':
      return `https://www.youtube.com/channel/${channel.channelId}`;
    default: {
      const exhaustiveCheck: never = channel.site;
      throw new Error(`Unknown site: ${exhaustiveCheck}`);
    }
  }
}

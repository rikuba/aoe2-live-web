import {
  EndedBroadcast,
  StreamGroup,
  UpcomingBroadcast,
} from '@aoe2-live/common';
import useSWR from 'swr';
import { EndedStreamList } from '../components/ended-streams';
import { Layout } from '../components/layout';
import { LiveStreamList } from '../components/live-stream-list';
import { UpcomingStreamList } from '../components/upcoming-streams';
import { useTimeStamp } from '../states';

export default function Home() {
  const now = useTimeStamp(60_000);

  const { data: streamGroups } = useSWR<StreamGroup[]>(
    '/api/live-stream-groups',
    { refreshInterval: 60_000, refreshWhenHidden: true }
  );

  const { data: upcomingStreams } = useSWR<UpcomingBroadcast[]>(
    '/api/upcoming-streams',
    { refreshInterval: 30 * 60_000 }
  );

  const { data: endedStreams } = useSWR<EndedBroadcast[]>(
    '/api/ended-streams',
    { refreshInterval: 2 * 60_000 }
  );

  const liveCount = streamGroups?.length ?? 0;
  let title = 'AoE2 Live';
  if (liveCount > 0) {
    title = `(${liveCount}) ${title}`;
  }

  return (
    <Layout title={title}>
      <LiveStreamList streamGroups={streamGroups} now={now} />
      <UpcomingStreamList streams={upcomingStreams} now={now} />
      <EndedStreamList streams={endedStreams} />
    </Layout>
  );
}

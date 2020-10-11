import { StreamGroup } from '@aoe2-live/common';
import useSWR, { SWRConfig } from 'swr';
import { EndedStreamList } from '../components/ended-streams';
import { Layout } from '../components/layout';
import { LiveStreamList } from '../components/live-stream-list';
import { UpcomingStreamList } from '../components/upcoming-streams';
import { useTimeStamp } from '../states';

export default function Home() {
  const now = useTimeStamp(60_000);
  const { data: streamGroups } = useSWR<StreamGroup[]>(
    '/api/live-stream-groups'
  );

  const liveCount = streamGroups?.length ?? 0;
  let title = 'AoE2 Live';
  if (liveCount > 0) {
    title = `(${liveCount}) ${title}`;
  }

  return (
    <SWRConfig value={{ refreshInterval: 60_000 }}>
      <Layout title={title}>
        <LiveStreamList streamGroups={streamGroups} timeStamp={now} />
        <UpcomingStreamList timeStamp={now} />
        <EndedStreamList />
      </Layout>
    </SWRConfig>
  );
}

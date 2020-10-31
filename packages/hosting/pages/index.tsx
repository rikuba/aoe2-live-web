import { StreamGroup } from '@aoe2-live/common';
import Head from 'next/head';
import useSWR, { SWRConfig } from 'swr';
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

  const liveCount = streamGroups?.length ?? 0;
  let title = 'AoE2 Live';
  if (liveCount > 0) {
    title = `(${liveCount}) ${title}`;
  }

  return (
    <SWRConfig value={{ dedupingInterval: 60_000 }}>
      <Layout>
        <Head>
          <title>{title}</title>
        </Head>
        <LiveStreamList now={now} />
        <UpcomingStreamList now={now} />
        <EndedStreamList />
      </Layout>
    </SWRConfig>
  );
}

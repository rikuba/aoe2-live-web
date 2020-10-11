import { SWRConfig } from 'swr';
import { EndedStreamList } from '../components/ended-streams';
import { Layout } from '../components/layout';
import { LiveStreamList } from '../components/live-stream-list';
import { UpcomingStreamList } from '../components/upcoming-streams';
import { useTimeStamp } from '../states';

export default function Home() {
  const now = useTimeStamp(60_000);

  return (
    <SWRConfig value={{ refreshInterval: 60_000 }}>
      <Layout title="AoE2 Live">
        <LiveStreamList timeStamp={now} />
        <UpcomingStreamList timeStamp={now} />
        <EndedStreamList />
      </Layout>
    </SWRConfig>
  );
}

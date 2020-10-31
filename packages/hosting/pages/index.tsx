import Head from 'next/head';
import { SWRConfig } from 'swr';
import { EndedStreamList } from '../components/ended-streams';
import { Layout } from '../components/layout';
import { LiveStreamList } from '../components/live-stream-list';
import { UpcomingStreamList } from '../components/upcoming-streams';
import { TimeStampContext, useTimeStamp } from '../states';

export default function Home() {
  const timeStamp = useTimeStamp(60_000);

  return (
    <SWRConfig value={{ dedupingInterval: 60_000 }}>
      <Layout>
        <TimeStampContext.Provider value={timeStamp}>
          <Head>
            <title>AoE2 Live</title>
          </Head>
          <LiveStreamList />
          <UpcomingStreamList />
          <EndedStreamList />
        </TimeStampContext.Provider>
      </Layout>
    </SWRConfig>
  );
}

import {
  EndedBroadcast,
  getChannelUrl,
  getSiteName,
  getVideoUrl,
} from '@aoe2-live/common';
import useSWR from 'swr';
import { favicon } from '../api';
import { formatDateTime, formatDuration } from '../util';
import { ExternalLink } from './external-link';

export function EndedStreamList() {
  const { data: streams, error } = useSWR<EndedBroadcast[]>(
    '/api/ended-streams',
    { refreshInterval: 2 * 60_000 }
  );

  return (
    <section className="section2">
      <h2 className="heading2">過去の配信一覧</h2>
      {error ? (
        <p>取得できませんでした。</p>
      ) : !streams ? (
        <p>取得中...</p>
      ) : (
        streams.map((stream) => (
          <EndedStream key={stream.streamId} {...stream} />
        ))
      )}
    </section>
  );
}

type EndedStreamProps = EndedBroadcast;

function EndedStream(stream: EndedStreamProps) {
  const videoUrl = getVideoUrl(stream);

  return (
    <div key={stream.streamId} className="my-4">
      <span>[{formatDateTime(stream.endTime)}]</span>

      <ExternalLink href={getChannelUrl(stream)} className="mx-2 font-bold">
        <img
          src={favicon(stream.site)}
          width="16"
          height="16"
          alt={getSiteName(stream.site)}
        />
        <span className="ml-1">{stream.channelName}</span>
      </ExternalLink>

      {videoUrl ? (
        <ExternalLink href={videoUrl}>
          <span>{stream.game}</span>
          <span>{stream.title}</span>
        </ExternalLink>
      ) : (
        <>
          {stream.game && <span className="mr-1">[{stream.game}]</span>}
          <span>{stream.title}</span>
        </>
      )}

      <span className="ml-1">
        ({formatDuration(stream.endTime - stream.startTime)})
      </span>

      {(stream.maxViewers ?? 0) > 0 && (
        <span className="ml-1">({stream.maxViewers}人)</span>
      )}
    </div>
  );
}

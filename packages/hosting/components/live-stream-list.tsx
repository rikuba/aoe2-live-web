import { getSiteName, StreamGroup } from '@aoe2-live/common';
import useSWR from 'swr';
import * as api from '../api';
import { formatDuration } from '../util';
import { ExternalLink } from './external-link';

type LiveStreamListProps = {
  now: number;
};

export function LiveStreamList({ now }: LiveStreamListProps) {
  const { data: streamGroups, error } = useSWR<StreamGroup[]>(
    '/api/live-stream-groups',
    { refreshInterval: 60_000, refreshWhenHidden: true }
  );

  return (
    <section className="section2">
      <h2 className="heading2">放送中の配信一覧</h2>
      {error ? (
        <p>取得できませんでした。</p>
      ) : !streamGroups ? (
        <p>取得中...</p>
      ) : streamGroups.length === 0 ? (
        <p>現在放送中の配信はありません。</p>
      ) : (
        streamGroups.map((group) => (
          <LiveStream key={group.userId} streamGroup={group} now={now} />
        ))
      )}
    </section>
  );
}

type LiveStreamProps = {
  streamGroup: StreamGroup;
  now: number;
};

function LiveStream({ streamGroup, now }: LiveStreamProps) {
  const stream = streamGroup.streams[0];

  const transparent =
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const handlerImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.src !== transparent) {
      e.currentTarget.src = transparent;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row mt-4">
      <ExternalLink
        href={stream.url}
        className="mb-1 sm:mr-3 w-full sm:w-thumbnail"
      >
        <img
          src={stream.thumbnail}
          width="192"
          height="108"
          className="bg-gray-600 w-full"
          onError={handlerImgError}
        />
      </ExternalLink>

      <div className="flex-1">
        <div>
          <ExternalLink href={stream.url} className="font-bold">
            {streamGroup.userId ?? stream.channelName}
          </ExternalLink>

          {streamGroup.totalViewers > 0 && (
            <span className="ml-1">({streamGroup.totalViewers}人)</span>
          )}

          {streamGroup.streams.map((stream, i, streams) => (
            <div
              key={stream.streamId}
              className="inline-block text-sm text-gray-800"
            >
              <ExternalLink href={stream.url} className="ml-2">
                <img
                  src={api.favicon(stream.site)}
                  width="16"
                  height="16"
                  alt={getSiteName(stream.site)}
                  className="mr-1"
                />
                {stream.channelName}
              </ExternalLink>
              {streams.length > 1 && (stream.viewers ?? 0) > 0 && (
                <span className="ml-1">({stream.viewers}人)</span>
              )}
            </div>
          ))}
        </div>

        <div>
          {stream.game && <span className="mr-2">[{stream.game}]</span>}
          <span>{stream.title}</span>
        </div>

        <div>{formatDuration(now - stream.startTime)}</div>
      </div>
    </div>
  );
}

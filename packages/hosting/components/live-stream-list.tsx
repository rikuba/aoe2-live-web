import { getSiteName, StreamGroup } from '@aoe2-live/common';
import * as api from '../api';
import { formatDuration } from '../util';
import { ExternalLink } from './external-link';

type LiveStreamListProps = {
  streamGroups: StreamGroup[] | undefined;
  timeStamp: number;
};

export function LiveStreamList({
  streamGroups,
  timeStamp,
}: LiveStreamListProps) {
  return (
    <section className="section2">
      <h2 className="heading2">放送中の配信一覧</h2>
      {!streamGroups ? (
        <p>配信情報を取得中...</p>
      ) : streamGroups.length === 0 ? (
        <p>現在放送中の配信はありません。</p>
      ) : (
        streamGroups.map((group) => (
          <LiveStream
            key={group.userId}
            streamGroup={group}
            timeStamp={timeStamp}
          />
        ))
      )}
    </section>
  );
}

type LiveStreamProps = {
  streamGroup: StreamGroup;
  timeStamp: number;
};

function LiveStream({ streamGroup, timeStamp }: LiveStreamProps) {
  const stream = streamGroup.streams[0];

  return (
    <div className="flex flex-col sm:flex-row mt-4">
      <ExternalLink href={stream.url}>
        <img
          src={stream.thumbnail}
          width="192"
          height="108"
          className="thumbnail mr-3"
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
              {streams.length > 1 && (
                <span className="ml-1">({stream.viewers}人)</span>
              )}
            </div>
          ))}
        </div>

        <div>
          {stream.game && <span className="mr-2">[{stream.game}]</span>}
          <span>{stream.title}</span>
        </div>

        <div>{formatDuration(timeStamp - stream.startTime)}</div>
      </div>
    </div>
  );
}

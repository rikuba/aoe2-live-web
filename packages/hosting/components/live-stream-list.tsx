import {
  getSiteName,
  groupStreamsByUser,
  StreamGroup,
} from '@aoe2-live/common';
import Head from 'next/head';
import * as api from '../api';
import { TimeStampContext, useLiveStreams } from '../states';
import { formatDuration } from '../util';
import { ExternalLink } from './external-link';

export function LiveStreamList() {
  const { streams, error } = useLiveStreams();
  const streamGroups = streams
    ? groupStreamsByUser(streams).sort(
        (a, b) => b.totalViewers - a.totalViewers
      )
    : undefined;

  const liveCount = streamGroups?.length ?? 0;
  let title = 'AoE2 Live';
  if (liveCount > 0) {
    title = `(${liveCount}) ${title}`;
  }

  return (
    <section className="section2">
      <Head>
        <title>{title}</title>
      </Head>
      <h2 className="heading2">放送中の配信一覧</h2>
      {error ? (
        <p>取得できませんでした。</p>
      ) : !streamGroups ? (
        <p>取得中...</p>
      ) : streamGroups.length === 0 ? (
        <p>現在放送中の配信はありません。</p>
      ) : (
        streamGroups.map((group) => (
          <LiveStream key={group.userId} streamGroup={group} />
        ))
      )}
    </section>
  );
}

type LiveStreamProps = {
  streamGroup: StreamGroup;
};

function LiveStream({ streamGroup }: LiveStreamProps) {
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

        <LiveDuration startTime={stream.startTime} />
      </div>
    </div>
  );
}

type LiveDurationProps = {
  startTime: number;
};

function LiveDuration({ startTime }: LiveDurationProps) {
  return (
    <TimeStampContext.Consumer>
      {(timeStamp) => <p>{formatDuration(timeStamp - startTime)}</p>}
    </TimeStampContext.Consumer>
  );
}

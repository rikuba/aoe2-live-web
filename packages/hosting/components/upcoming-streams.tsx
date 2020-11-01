import { getSiteName, UpcomingBroadcast } from '@aoe2-live/common';
import * as api from '../api';
import { TimeStampContext, useUpcomingStreams } from '../states';
import { formatDateTime, formatDuration } from '../util';
import { ExternalLink } from './external-link';

export function UpcomingStreamList() {
  const { streams, error } = useUpcomingStreams();

  if (process.env.NODE_ENV === 'development') {
    if (error) {
      console.error(error);
    }
  }

  if (error || !streams || streams.length === 0) {
    return null;
  }

  return (
    <section className="section2">
      <h2 className="heading2">放送予定</h2>
      {streams.map((stream) => (
        <UpcomingStream key={stream.streamId} stream={stream} />
      ))}
    </section>
  );
}

type UpcomingStreamProps = {
  stream: UpcomingBroadcast;
};

function UpcomingStream({ stream }: UpcomingStreamProps) {
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
        />
      </ExternalLink>

      <div className="flex-1">
        <div>
          <ExternalLink href={stream.url} className="font-bold">
            {stream.userId ?? stream.channelName}
          </ExternalLink>
          <div className="inline-block text-sm text-gray-800">
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
          </div>
        </div>

        <div>
          {stream.game && <span className="mr-2">[{stream.game}]</span>}
          <span>{stream.title}</span>
        </div>

        <UpcomingDuration startTime={stream.startTime} />
      </div>
    </div>
  );
}

type UpcomingDurationProps = {
  startTime: number;
};

function UpcomingDuration({ startTime }: UpcomingDurationProps) {
  return (
    <TimeStampContext.Consumer>
      {(timeStamp) => {
        const timeLeft = startTime - timeStamp;
        const timeLeftString =
          timeLeft <= 60 * 1000
            ? '間もなく開始'
            : `あと${formatDuration(timeLeft)}`;
        return (
          <p>
            {`${formatDateTime(startTime)}開始`}
            {` (${timeLeftString})`}
          </p>
        );
      }}
    </TimeStampContext.Consumer>
  );
}

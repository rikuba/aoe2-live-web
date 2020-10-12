import { getSiteName, UpcomingBroadcast } from '@aoe2-live/common';
import * as api from '../api';
import { formatDateTime, formatDuration } from '../util';
import { ExternalLink } from './external-link';
import useSWR from 'swr';

type UpcomingStreamListProps = {
  timeStamp: number;
};

export function UpcomingStreamList({ timeStamp }: UpcomingStreamListProps) {
  const { data: streams } = useSWR<UpcomingBroadcast[]>(
    '/api/upcoming-streams'
  );

  if (!streams || streams.length === 0) {
    return null;
  }

  return (
    <section className="section2">
      <h2 className="heading2">放送予定</h2>
      {streams.map((stream) => (
        <UpcomingStream
          key={stream.streamId}
          {...stream}
          timeStamp={timeStamp}
        />
      ))}
    </section>
  );
}

type UpcomingStreamProps = UpcomingBroadcast & {
  timeStamp: number;
};

function UpcomingStream({ timeStamp, ...stream }: UpcomingStreamProps) {
  return (
    <div className="flex mt-4">
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

        <div>
          {`${formatDateTime(stream.startTime)}開始`}
          {` (あと${formatDuration(stream.startTime - timeStamp)})`}
        </div>
      </div>
    </div>
  );
}

import { getSiteName, UpcomingBroadcast } from '@aoe2-live/common';
import useSWR from 'swr';
import * as api from '../api';
import { formatDateTime, formatDuration } from '../util';
import { ExternalLink } from './external-link';

type UpcomingStreamListProps = {
  now: number;
};

export function UpcomingStreamList({ now }: UpcomingStreamListProps) {
  const { data: streams, error } = useSWR<UpcomingBroadcast[]>(
    '/api/upcoming-streams',
    { refreshInterval: 5 * 60_000 }
  );

  if (error || !streams || streams.length === 0) {
    return null;
  }

  return (
    <section className="section2">
      <h2 className="heading2">放送予定</h2>
      {streams.map((stream) => (
        <UpcomingStream key={stream.streamId} {...stream} now={now} />
      ))}
    </section>
  );
}

type UpcomingStreamProps = UpcomingBroadcast & {
  now: number;
};

function UpcomingStream({ now, ...stream }: UpcomingStreamProps) {
  const timeLeft = stream.startTime - now;
  const timeLeftString =
    timeLeft <= 60 * 1000 ? '間もなく開始' : `あと${formatDuration(timeLeft)}`;

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
          {` (${timeLeftString})`}
        </div>
      </div>
    </div>
  );
}

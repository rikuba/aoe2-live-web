import { Channel, getChannelUrl, getSiteName, SiteId } from '@aoe2-live/common';
import { GetStaticProps } from 'next';
import { ExternalLink } from '../components/external-link';
import { Layout } from '../components/layout';
import * as api from '../api';

type AboutProps = {
  channels: Channel[];
};

export default function About({ channels }: AboutProps) {
  const sites: SiteId[] = ['kukulu', 'mildom', 'openrec', 'twitch', 'youtube'];

  return (
    <Layout title="AoE2 Live について">
      <section className="section2">
        <h2 className="heading2">AoE2 Live について</h2>
        <p className="py-4">
          このサイトでは Age of Empires II: Definitive Edition (AoE2 DE)
          の生放送の配信状況をまとめています。
        </p>

        <section>
          <h3 className="font-bold">チャンネル登録について</h3>
          <p className="my-4">
            掲載対象となるチャンネルは現在手動で登録・管理しています。
            配信者ご自身によるチャンネルの管理機能は今後実装予定です。
            チャンネル情報の登録・変更・削除等ご希望の方は、お手数ですが以下のいずれかの連絡先へご連絡ください。
          </p>

          <ul className="list-disc pl-4 my-4">
            <li>
              Twitter:{' '}
              <ExternalLink href="https://twitter.com/aoe2_live">
                @aoe2_live
              </ExternalLink>
            </li>
            <li>
              掲示板:{' '}
              <ExternalLink href="http://jbbs.shitaraba.net/bbs/read.cgi/netgame/10071/1393777787/133n-">
                AOC Streams ご意見板(´ﾟωﾟ`)ﾅｯﾂｴﾚｶﾞﾝﾄ
              </ExternalLink>
            </li>
            <li>メール: owner+aoe2.live（+を@に変更してください）</li>
          </ul>

          <p className="my-4">
            現在掲載対象ではない配信サイトにもできる限り対応します。
          </p>
        </section>

        <section>
          <h3 className="font-bold">登録チャンネル一覧</h3>
          {sites.map((site) => (
            <ChannelList key={site} site={site} channels={channels} />
          ))}
        </section>
      </section>
    </Layout>
  );
}

type ChannelListProps = {
  site: SiteId;
  channels: Channel[];
};

function ChannelList({ site, channels }: ChannelListProps) {
  const siteName = getSiteName(site);
  const siteChannels = channels.filter((c) => c.site === site);

  return (
    <section>
      <h4 className="my-4">
        <img src={api.favicon(site)} width="16" height="16" className="mr-1" />
        {siteName}
      </h4>

      <ul className="list-disc pl-4 my-4 columns">
        {siteChannels.map((channel) => {
          const url = getChannelUrl(channel);
          return (
            <li key={url}>
              <ExternalLink href={url}>
                {channel.userId ?? channel.channelId}
              </ExternalLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  const channels = await api.channels().catch(() => []);

  return {
    props: { channels },
  };
};

import { Broadcast } from '@aoe2-live/common';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { app } from './app';

export const onRequest = functions.https.onRequest(app);

const purge = (url: string) => fetch(url, { method: 'PURGE' });

export const onChannelChange = functions
  .region('asia-northeast1')
  .firestore.document('channels/{channelId}')
  .onWrite(async () => {
    await purge('https://aoe2.live/api/channels');
  });

export const onStreamChange = functions
  .region('asia-northeast1')
  .firestore.document('streams/{streamId}')
  .onUpdate(async (change) => {
    const before = change.before.data() as Broadcast;
    const after = change.after.data() as Broadcast;
    if (after.status === 'ended') {
      await purge('https://aoe2.live/api/ended-streams');
    } else if (before.status === 'upcoming' || after.status === 'upcoming') {
      await purge('https://aoe2.live/api/upcoming-streams');
    }
  });

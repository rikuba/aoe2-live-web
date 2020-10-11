import { Broadcast } from '@aoe2-live/common';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { app } from './app';

export const onRequest = functions.https.onRequest(app);

export const onChannelChange = functions
  .region('asia-northeast1')
  .firestore.document('channels/{channelId}')
  .onWrite(async () => {
    await fetch('https://aoe2.live/api/channels', { method: 'PURGE' });
  });

export const onStreamEnd = functions
  .region('asia-northeast1')
  .firestore.document('streams/{streamId}')
  .onUpdate(async (change) => {
    const stream = change.after.data() as Broadcast;
    if (stream.status === 'ended') {
      await fetch('https://aoe2.live/api/ended-streams', { method: 'PURGE' });
    }
  });

import { Broadcast } from '@aoe2-live/common';
import * as functions from 'firebase-functions';
import * as https from 'https';
import { app } from './app';

export const onRequest = functions.https.onRequest(app);

export const onChannelChange = functions
  .region('asia-northeast1')
  .firestore.document('channels/{channelId}')
  .onWrite(async () => {
    await sendPurgeRequest('https://aoe2.live/api/channels');
  });

export const onStreamEnd = functions
  .region('asia-northeast1')
  .firestore.document('streams/{streamId}')
  .onUpdate(async (change) => {
    const stream = change.after.data() as Broadcast;
    if (stream.status === 'ended') {
      await sendPurgeRequest('https://aoe2.live/api/ended-streams');
    }
  });

async function sendPurgeRequest(url: string) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, resolve);
    req.on('error', reject);
    req.end();
  });
}

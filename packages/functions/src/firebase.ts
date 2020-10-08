import {
  EndedBroadcast,
  LiveBroadcast,
  UpcomingBroadcast,
} from '@aoe2-live/common';
import { Channel } from '@aoe2-live/common';
import * as admin from 'firebase-admin';

const firebase = admin.apps.length > 0 ? admin.app() : admin.initializeApp();
const firestore = firebase.firestore();

function restoreData(data: FirebaseFirestore.DocumentData): unknown {
  for (const key of Object.keys(data) as (keyof typeof data)[]) {
    if (data[key] !== null && typeof data[key].toMillis === 'function') {
      data[key] = data[key].toMillis();
    }
  }
  return data;
}

export async function takeChannels() {
  const collection = await firestore.collection('channels').get();
  const channels = collection.docs.map((doc) => doc.data()) as Channel[];
  return channels.concat().sort((a, b) => {
    return (a.userId || a.channelId).localeCompare(b.userId || b.channelId);
  });
}

export async function takeStreams<T extends 'live' | 'upcoming'>({
  status,
}: {
  status: T;
}) {
  const collection = await firestore
    .collection('streams')
    .where('status', '==', status)
    .get();
  return collection.docs.map((doc) => restoreData(doc.data())) as {
    live: LiveBroadcast;
    upcoming: UpcomingBroadcast;
  }[T][];
}

export async function takeEndedStreams({
  limit = 10,
}: {
  limit?: number;
} = {}) {
  const collection = await firestore
    .collection('streams')
    .orderBy('endTime', 'desc')
    .limit(limit)
    .get();
  return collection.docs.map((doc) =>
    restoreData(doc.data())
  ) as EndedBroadcast[];
}

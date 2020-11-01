import {
  EndedBroadcast,
  LiveBroadcast,
  UpcomingBroadcast,
} from '@aoe2-live/common';
import { createContext, useEffect, useState } from 'react';
import { firebaseApp, restoreData } from '../firebase';

export const TimeStampContext = createContext(0);

/**
 * @param interval milliseconds
 */
export function useTimeStamp(interval: number) {
  const [timeStamp, setTimeStamp] = useState(Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeStamp(Date.now());
    }, interval);

    return () => clearTimeout(timerId);
  }, []);

  return timeStamp;
}

export function useLiveStreams() {
  const [error, setError] = useState<Error>();
  const [streams, setStreams] = useState<LiveBroadcast[]>();

  useEffect(() => {
    return firebaseApp
      .firestore()
      .collection('streams')
      .where('status', '==', 'live')
      .onSnapshot((snapshot) => {
        const latestStreams = snapshot.docs.map(
          (doc) => restoreData(doc.data()) as LiveBroadcast
        );
        setStreams(latestStreams);
      }, setError);
  }, []);

  return { error, streams };
}

export function useUpcomingStreams() {
  const [error, setError] = useState<Error>();
  const [streams, setStreams] = useState<UpcomingBroadcast[]>();

  useEffect(() => {
    return firebaseApp
      .firestore()
      .collection('streams')
      .where('status', '==', 'upcoming')
      .onSnapshot((snapshot) => {
        const latestStreams = snapshot.docs.map(
          (doc) => restoreData(doc.data()) as UpcomingBroadcast
        );
        setStreams(latestStreams);
      }, setError);
  }, []);

  return { error, streams };
}

export function useEndedStreams() {
  const [error, setError] = useState<Error>();
  const [streams, setStreams] = useState<EndedBroadcast[]>();

  useEffect(() => {
    const limit = 15;
    return firebaseApp
      .firestore()
      .collection('streams')
      .orderBy('endTime', 'desc')
      .limit(limit)
      .onSnapshot((snapshot) => {
        const latestStreams = snapshot.docs.map(
          (doc) => restoreData(doc.data()) as EndedBroadcast
        );
        setStreams(latestStreams);
      }, setError);
  }, []);

  return { error, streams };
}

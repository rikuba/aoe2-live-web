import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCVn7-Odxroyxis30wnq9qCXgOvHYgnVkY',
  authDomain: 'aoe2-live.firebaseapp.com',
  databaseURL: 'https://aoe2-live.firebaseio.com',
  projectId: 'aoe2-live',
  storageBucket: 'aoe2-live.appspot.com',
  messagingSenderId: '167345388756',
  appId: '1:167345388756:web:cabd9ca8d79cca10714f41',
  measurementId: 'G-EHFPYKVXMB',
};

export const firebaseApp =
  firebase.apps.length > 0
    ? firebase.app()
    : firebase.initializeApp(firebaseConfig);

export function restoreData<T extends firebase.firestore.DocumentData>(
  data: T
): {
  [P in keyof T]: T[P] extends firebase.firestore.Timestamp ? Date : T[P];
} {
  for (const key of Object.keys(data) as (keyof T)[]) {
    if (data[key] !== null && typeof data[key].toMillis === 'function') {
      data[key] = data[key].toMillis();
    }
  }
  return data;
}

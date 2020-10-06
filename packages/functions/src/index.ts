import * as functions from 'firebase-functions';
import { app } from './app';

export const onRequest = functions.https.onRequest(app);

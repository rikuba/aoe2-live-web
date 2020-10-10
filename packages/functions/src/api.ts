import { RequestHandler, Router } from 'express';
import { takeChannels, takeEndedStreams, takeStreams } from './firebase';

const api = Router();

function handler(fn: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

api.get(
  '/channels',
  handler(async (req, res) => {
    res.setHeader('Cache-Control', `public, s-maxage=${60 * 60 * 24}`);
    res.json(await takeChannels());
  })
);

api.get(
  '/live-streams',
  handler(async (req, res) => {
    res.setHeader('Cache-Control', `public, s-maxage=60`);
    res.json(await takeStreams({ status: 'live' }));
  })
);

api.get(
  '/upcoming-streams',
  handler(async (req, res) => {
    res.setHeader('Cache-Control', `public, s-maxage=${60 * 60 * 24}`);
    res.json(await takeStreams({ status: 'upcoming' }));
  })
);

api.get(
  '/ended-streams',
  handler(async (req, res) => {
    res.setHeader('Cache-Control', `public, s-maxage=60`);
    res.json(await takeEndedStreams());
  })
);

export { api };

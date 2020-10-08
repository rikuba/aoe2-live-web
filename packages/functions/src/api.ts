import { fetchFaviconUrl, verifyThumbnailUrl } from '@aoe2-live/common';
import { RequestHandler, Router } from 'express';
import * as fileType from 'file-type';
import fetch from 'node-fetch';
import * as sharp from 'sharp';
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

api.get(
  '/favicon/:site',
  handler(async (req, res) => {
    const { site } = req.params as { site?: string };
    if (!site) {
      throw new Error(`No site`);
    }
    const url = await fetchFaviconUrl(site);
    let buffer = await fetch(url).then((res) => res.buffer());
    const type = await fileType.fromBuffer(buffer);
    if (type && type.ext !== 'ico') {
      buffer = await sharp(buffer).resize(32, 32).toBuffer();
    }
    res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24 * 7}`);
    res.setHeader('Content-Type', type?.mime ?? 'image/vnd.microsoft.icon');
    res.send(buffer);
  })
);

api.get(
  '/thumbnail',
  handler(async (req, res) => {
    const { url } = req.query as { url?: string };
    if (!url) {
      throw new Error('No url');
    }

    const match = verifyThumbnailUrl(url);
    if (!match) {
      throw new Error(`Not allowed url: ${url}`);
    }

    let buffer = await fetch(url).then((res) => res.buffer());
    const type = await fileType.fromBuffer(buffer);
    const sh = sharp(buffer);
    const { width, height } = await sh.metadata();
    if ((width && width > 192) || (height && height > 108)) {
      buffer = await sh.resize(192, 108).toBuffer();
    }
    res.setHeader('Cache-Control', `public, max-age=300`);
    res.setHeader('Content-Type', type?.mime ?? 'image/jpeg');
    res.send(buffer);
  })
);

export { api };

import * as compression from 'compression';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as functions from 'firebase-functions';
import { api } from './api';

const app = express();
app.use(compression());
app.use('/api', api);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  functions.logger.error(err.stack);
  res.status(500).json({ error: { name: err.name, message: err.message } });
});

export { app };

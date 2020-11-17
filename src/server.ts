import 'reflect-metadata';

import * as mongoose from 'mongoose';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

import * as pkg from '../package.json';

import Logger, { logger } from './core/logger';
import { response } from './core/response';

dotenv.config({ path: !!process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' });

import * as routes from './routes';

export async function startServer() {
  const app = express();

  try {
    Logger.info(`connecting to ${process.env.DB}...`);

    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.get('/', (_req, res) => {
      res.send({ version: pkg.version });
    });

    app.use(logger);
    app.use(response);

    app.use(routes.filesRoute);
    app.use(routes.usersRoute);
    app.use(routes.organizationsRoute);
    app.use(routes.projectsRoute);

    return app;
  } catch (e) {
    Logger.error(e);
  }
}

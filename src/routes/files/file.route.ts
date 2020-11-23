import * as express from 'express';

import { auth } from '../../core/auth';

import { Uploader } from './uploader';
import * as endpoints from './endpoints';

const uploader = new Uploader('uploads');

export const filesRoute = express.Router()
.get(
  '/files/:fileId',
  endpoints.findOne,
)
.post(
  '/files',
  auth,
  uploader.single('file'),
  endpoints.create,
);

import * as express from 'express';

import { auth } from '../../../../core/auth';
import { pagination } from '../../../../core/pagination';
import { validateResponse } from '../../../../core/validate';

import { FindCommentResponseSchema } from '../../../comments/endpoints/find/find-response.dto';

import * as endpoints from './endpoints';

export const commentsRoute = express.Router()
.use(auth)
.get(
  '/users/:username/comments',
  pagination,
  validateResponse(FindCommentResponseSchema),
  endpoints.find,
);

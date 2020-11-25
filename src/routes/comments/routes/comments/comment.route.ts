import * as express from 'express';

import { auth } from '../../../../core/auth';
import { validateBody, validateResponse } from '../../../../core/validate';

import { CreateCommentRequestSchema, CreateCommentResponseSchema } from '../../../tickets/routes/comments/endpoints/create';

import { FindCommentResponseSchema } from '../../endpoints/find/find-response.dto';

import * as endpoints from './endpoints';

export const commentsRoute = express.Router()
.use(auth)
.get(
  '/comments/:commentId/comments',
  validateResponse(FindCommentResponseSchema),
  endpoints.find,
)
.post(
  '/comments/:commentId/comments',
  validateBody(CreateCommentRequestSchema),
  validateResponse(CreateCommentResponseSchema),
  endpoints.create,
);

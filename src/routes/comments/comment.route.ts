import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const commentsRoute = express.Router()
.use(routes.likesRoute)
.use(routes.commentsRoute)
.get(
  '/comments',
  pagination,
  validateResponse(endpoints.FindCommentResponseSchema),
  endpoints.find,
)
.get(
  '/comments/:commentId',
  validateResponse(endpoints.FindOneCommentResponseSchema),
  endpoints.findOne,
)
.put(
  '/comments/:commentId',
  auth,
  validateBody(endpoints.UpdateCommentRequestSchema),
  validateResponse(endpoints.UpdateCommentResponseSchema),
  endpoints.update,
)
.delete(
  '/comments/:commentId',
  auth,
  validateResponse(endpoints.RemoveCommentResponseSchema),
  endpoints.remove,
);

import * as express from 'express';

import { auth } from '../../core/auth';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const commentsRoute = express.Router()
.use(auth)
.use(routes.likesRoute)
.get(
  '/comments/:commentId',
  validateResponse(endpoints.FindOneCommentResponseSchema),
  endpoints.findOne,
)
.put(
  '/comments/:commentId',
  validateBody(endpoints.UpdateCommentRequestSchema),
  validateResponse(endpoints.UpdateCommentResponseSchema),
  endpoints.update,
)
.delete(
  '/comments/:commentId',
  validateResponse(endpoints.RemoveCommentResponseSchema),
  endpoints.remove,
);

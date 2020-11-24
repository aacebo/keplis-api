import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const commentsRoute = express.Router()
.use(auth)
.use(routes.likesRoute)
.get(
  '/organizations/:orgName/projects/:projectName/tickets/:ticketNumber/comments',
  pagination,
  validateResponse(endpoints.FindCommentResponseSchema),
  endpoints.find,
)
.get(
  '/comments/:commentId',
  validateResponse(endpoints.FindOneCommentResponseSchema),
  endpoints.findOne,
)
.post(
  '/organizations/:orgName/projects/:projectName/tickets/:ticketNumber/comments',
  validateBody(endpoints.CreateCommentRequestSchema),
  validateResponse(endpoints.CreateCommentResponseSchema),
  endpoints.create,
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

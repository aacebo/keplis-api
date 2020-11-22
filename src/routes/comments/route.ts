import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';

export const commentsRoute = express.Router()
.use(auth)
.get(
  '/organizations/:orgName/projects/:projectName/tickets/:ticketNumber/comments',
  pagination,
  validateResponse(endpoints.FindCommentResponseSchema),
  endpoints.find,
);

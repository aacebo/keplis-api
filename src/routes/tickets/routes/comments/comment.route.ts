import * as express from 'express';

import { auth } from '../../../../core/auth';
import { pagination } from '../../../../core/pagination';
import { validateBody, validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const commentsRoute = express.Router()
.get(
  '/tickets/:ticketNumber/comments',
  pagination,
  validateResponse(endpoints.FindCommentResponseSchema),
  endpoints.find,
)
.post(
  '/tickets/:ticketNumber/comments',
  auth,
  validateBody(endpoints.CreateCommentRequestSchema),
  validateResponse(endpoints.CreateCommentResponseSchema),
  endpoints.create,
);

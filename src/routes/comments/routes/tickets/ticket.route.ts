import * as express from 'express';

import { auth } from '../../../../core/auth';
import { pagination } from '../../../../core/pagination';
import { validateBody, validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const ticketsRoute = express.Router()
.use(auth)
.get(
  '/tickets/:ticketNumber/comments',
  pagination,
  validateResponse(endpoints.FindCommentResponseSchema),
  endpoints.find,
)
.post(
  '/tickets/:ticketNumber/comments',
  validateBody(endpoints.CreateCommentRequestSchema),
  validateResponse(endpoints.CreateCommentResponseSchema),
  endpoints.create,
);

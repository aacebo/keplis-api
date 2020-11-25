import * as express from 'express';

import { auth } from '../../../../core/auth';
import { pagination } from '../../../../core/pagination';
import { validateBody, validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const ticketsRoute = express.Router()
.use(auth)
.get(
  '/projects/:projectName/tickets',
  pagination,
  validateResponse(endpoints.FindTicketResponseSchema),
  endpoints.find,
)
.post(
  '/projects/:projectName/tickets',
  validateBody(endpoints.CreateTicketRequestSchema),
  validateResponse(endpoints.CreateTicketResponseSchema),
  endpoints.create,
);

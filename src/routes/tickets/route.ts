import * as express from 'express';

import { auth } from '../../core/auth';
// import { pagination } from '../../../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';

export const ticketsRoute = express.Router()
.use(auth)
.post(
  '/organizations/:orgName/projects/:projectName/tickets',
  validateBody(endpoints.CreateTicketRequestSchema),
  validateResponse(endpoints.CreateTicketResponseSchema),
  endpoints.create,
)
.put(
  '/organizations/:orgName/projects/:projectName/tickets/:ticketNumber',
  validateBody(endpoints.UpdateTicketRequestSchema),
  validateResponse(endpoints.UpdateTicketResponseSchema),
  endpoints.update,
);


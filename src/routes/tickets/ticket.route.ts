import * as express from 'express';

import { auth } from '../../core/auth';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const ticketsRoute = express.Router()
.use(auth)
.use(routes.commentsRoute)
.get(
  '/tickets/:ticketNumber',
  validateResponse(endpoints.FindOneTicketResponseSchema),
  endpoints.findOne,
)
.put(
  '/tickets/:ticketNumber',
  validateBody(endpoints.UpdateTicketRequestSchema),
  validateResponse(endpoints.UpdateTicketResponseSchema),
  endpoints.update,
)
.delete(
  '/tickets/:ticketNumber',
  validateResponse(endpoints.RemoveTicketResponseSchema),
  endpoints.remove,
);

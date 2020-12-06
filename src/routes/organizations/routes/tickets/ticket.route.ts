import * as express from 'express';

import { pagination } from '../../../../core/pagination';
import { validateResponse } from '../../../../core/validate';

import { FindTicketResponseSchema } from '../../../tickets/endpoints/find/find-response.dto';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const ticketsRoute = express.Router()
.use(routes.statsRoute)
.get(
  '/organizations/:orgName/tickets',
  pagination,
  validateResponse(FindTicketResponseSchema),
  endpoints.find,
);

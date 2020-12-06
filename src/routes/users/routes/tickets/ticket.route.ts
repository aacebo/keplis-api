import * as express from 'express';

import { pagination } from '../../../../core/pagination';
import { validateResponse } from '../../../../core/validate';

import { FindTicketResponseSchema } from '../../../tickets/endpoints/find/find-response.dto';

import * as endpoints from './endpoints';

export const ticketsRoute = express.Router()
.get(
  '/users/:username/tickets',
  pagination,
  validateResponse(FindTicketResponseSchema),
  endpoints.find,
);

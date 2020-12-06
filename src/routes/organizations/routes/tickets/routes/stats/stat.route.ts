import * as express from 'express';

import { validateResponse } from '../../../../../../core/validate';

import * as endpoints from './endpoints';

export const statsRoute = express.Router()
.get(
  '/organizations/:orgName/tickets/stats/types',
  validateResponse(endpoints.TypesTicketResponseSchema),
  endpoints.types,
)
.get(
  '/organizations/:orgName/tickets/stats/statuses',
  validateResponse(endpoints.StatusesTicketResponseSchema),
  endpoints.statuses,
)
.get(
  '/organizations/:orgName/tickets/stats/labels',
  validateResponse(endpoints.LabelsTicketResponseSchema),
  endpoints.labels,
);

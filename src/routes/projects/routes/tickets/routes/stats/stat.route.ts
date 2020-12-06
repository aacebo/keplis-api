import * as express from 'express';

import { validateResponse } from '../../../../../../core/validate';

import * as endpoints from './endpoints';

export const statsRoute = express.Router()
.get(
  '/projects/:projectName/tickets/stats/types',
  validateResponse(endpoints.TypesTicketResponseSchema),
  endpoints.types,
)
.get(
  '/projects/:projectName/tickets/stats/statuses',
  validateResponse(endpoints.StatusesTicketResponseSchema),
  endpoints.statuses,
)
.get(
  '/projects/:projectName/tickets/stats/labels',
  validateResponse(endpoints.LabelsTicketResponseSchema),
  endpoints.labels,
);

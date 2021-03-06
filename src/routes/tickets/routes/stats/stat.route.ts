import * as express from 'express';

import { validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const statsRoute = express.Router()
.get(
  '/tickets/stats/types',
  validateResponse(endpoints.TypesTicketResponseSchema),
  endpoints.types,
)
.get(
  '/tickets/stats/statuses',
  validateResponse(endpoints.StatusesTicketResponseSchema),
  endpoints.statuses,
)
.get(
  '/tickets/stats/labels',
  validateResponse(endpoints.LabelsTicketResponseSchema),
  endpoints.labels,
);

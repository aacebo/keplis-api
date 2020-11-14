import * as express from 'express';

import { auth } from '../../../../core/auth';
import { validateBody, validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const organizationOwnersRoute = express.Router()
.use(auth)
.put(
  '/organizations/:name/owners',
  validateBody(endpoints.UpdateOrganizationOwnerRequestSchema),
  validateResponse(endpoints.UpdateOrganizationOwnerResponseSchema),
  endpoints.update,
);

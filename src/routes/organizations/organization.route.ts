import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const organizationsRoute = express.Router()
.use(auth)
.use(routes.ownersRoute)
.use(routes.projectsRoute)
.use(routes.ticketsRoute)
.get(
  '/organizations',
  pagination,
  validateResponse(endpoints.FindOrganizationResponseSchema),
  endpoints.find,
)
.get(
  '/organizations/:orgName',
  validateResponse(endpoints.FindOneOrganizationResponseSchema),
  endpoints.findOne,
)
.post(
  '/organizations',
  validateBody(endpoints.CreateOrganizationRequestSchema),
  validateResponse(endpoints.CreateOrganizationResponseSchema),
  endpoints.create,
)
.put(
  '/organizations/:orgName',
  validateBody(endpoints.UpdateOrganizationRequestSchema),
  validateResponse(endpoints.UpdateOrganizationResponseSchema),
  endpoints.update,
)
.delete(
  '/organizations/:orgName',
  validateResponse(endpoints.RemoveOrganizationResponseSchema),
  endpoints.remove,
);

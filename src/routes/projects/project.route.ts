import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const projectsRoute = express.Router()
.use(routes.ticketsRoute)
.get(
  '/projects',
  pagination,
  validateResponse(endpoints.FindProjectResponseSchema),
  endpoints.find,
)
.get(
  '/projects/:projectName',
  validateResponse(endpoints.FindOneProjectResponseSchema),
  endpoints.findOne,
)
.put(
  '/projects/:projectName',
  auth,
  validateBody(endpoints.UpdateProjectRequestSchema),
  validateResponse(endpoints.UpdateProjectResponseSchema),
  endpoints.update,
)
.delete(
  '/projects/:projectName',
  auth,
  validateResponse(endpoints.RemoveProjectResponseSchema),
  endpoints.remove,
);

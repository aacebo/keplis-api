import * as express from 'express';

import { auth } from '../../core/auth';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const projectsRoute = express.Router()
.use(auth)
.use(routes.organizationsRoute)
.get(
  '/projects/:projectName',
  validateResponse(endpoints.FindOneProjectResponseSchema),
  endpoints.findOne,
)
.put(
  '/projects/:projectName',
  validateBody(endpoints.UpdateProjectRequestSchema),
  validateResponse(endpoints.UpdateProjectResponseSchema),
  endpoints.update,
)
.delete(
  '/projects/:projectName',
  validateResponse(endpoints.RemoveProjectResponseSchema),
  endpoints.remove,
);

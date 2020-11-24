import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';

export const projectsRoute = express.Router()
.use(auth)
.get(
  '/organizations/:orgName/projects',
  pagination,
  validateResponse(endpoints.FindProjectResponseSchema),
  endpoints.find,
)
.get(
  '/projects/:projectName',
  validateResponse(endpoints.FindOneProjectResponseSchema),
  endpoints.findOne,
)
.post(
  '/organizations/:orgName/projects',
  validateBody(endpoints.CreateProjectRequestSchema),
  validateResponse(endpoints.CreateProjectResponseSchema),
  endpoints.create,
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

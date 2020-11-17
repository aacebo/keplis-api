import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';

export const projectsRoute = express.Router()
.use(auth)
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
.post(
  '/organizations',
  validateBody(endpoints.CreateProjectRequestSchema),
  validateResponse(endpoints.CreateProjectResponseSchema),
  endpoints.create,
);

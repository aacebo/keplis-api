import * as express from 'express';

import { auth } from '../../../../core/auth';
import { pagination } from '../../../../core/pagination';
import { validateBody, validateResponse } from '../../../../core/validate';

import * as endpoints from './endpoints';

export const projectsRoute = express.Router()
.use(auth)
.get(
  '/organizations/:orgName/projects',
  pagination,
  validateResponse(endpoints.FindProjectResponseSchema),
  endpoints.find,
)
.post(
  '/organizations/:orgName/projects',
  validateBody(endpoints.CreateProjectRequestSchema),
  validateResponse(endpoints.CreateProjectResponseSchema),
  endpoints.create,
);

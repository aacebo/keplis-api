import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';

export const projectsRoute = express.Router()
.use(auth)
.get(
  '/projects',
  pagination,
  validateResponse(endpoints.FindProjectResponseSchema),
  endpoints.find,
);

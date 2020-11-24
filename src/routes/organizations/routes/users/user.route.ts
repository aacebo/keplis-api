import * as express from 'express';

import { auth } from '../../../../core/auth';
import { pagination } from '../../../../core/pagination';
import { validateResponse } from '../../../../core/validate';

import { FindOrganizationResponseSchema } from '../../endpoints/find/find-response.dto';

import * as endpoints from './endpoints';

export const usersRoute = express.Router()
.use(auth)
.get(
  '/users/:username/organizations',
  pagination,
  validateResponse(FindOrganizationResponseSchema),
  endpoints.find,
);

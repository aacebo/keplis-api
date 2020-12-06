import * as express from 'express';

import { pagination } from '../../../../core/pagination';
import { validateResponse } from '../../../../core/validate';

import { FindOrganizationResponseSchema } from '../../../organizations/endpoints/find/find-response.dto';

import * as endpoints from './endpoints';

export const organizationsRoute = express.Router()
.get(
  '/users/:username/organizations',
  pagination,
  validateResponse(FindOrganizationResponseSchema),
  endpoints.find,
);

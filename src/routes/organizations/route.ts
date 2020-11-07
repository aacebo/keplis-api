import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';

export const organizationsRoute = express.Router()
.use(auth)
.get(
  '/organizations',
  pagination,
  validateResponse(endpoints.FindOrganizationResponseSchema),
  endpoints.find,
)
.get(
  '/organizations/:orgId',
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
  '/organizations/:orgId',
  validateBody(endpoints.UpdateOrganizationRequestSchema),
  validateResponse(endpoints.UpdateOrganizationResponseSchema),
  endpoints.update,
)
// .delete(
//   '/posts/:postId',
//   validateResponse(endpoints.RemovePostResponseSchema),
//   endpoints.remove,
// );

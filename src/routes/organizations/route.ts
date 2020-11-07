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
// .get(
//   '/posts/:postId',
//   validateResponse(endpoints.FindOnePostResponseSchema),
//   endpoints.findOne,
// )
.post(
  '/organizations',
  validateBody(endpoints.CreateOrganizationRequestSchema),
  validateResponse(endpoints.CreateOrganizationResponseSchema),
  endpoints.create,
);
// .put(
//   '/posts/:postId',
//   validateBody(endpoints.UpdatePostRequestSchema),
//   validateResponse(endpoints.UpdatePostResponseSchema),
//   endpoints.update,
// )
// .delete(
//   '/posts/:postId',
//   validateResponse(endpoints.RemovePostResponseSchema),
//   endpoints.remove,
// );

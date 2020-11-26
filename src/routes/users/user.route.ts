import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';
import * as routes from './routes';

export const usersRoute = express.Router()
.get(
  '/users',
  auth,
  pagination,
  validateResponse(endpoints.FindUserResponseSchema),
  endpoints.find,
)
.get(
  '/users/:username',
  auth,
  validateResponse(endpoints.FindOneUserResponseSchema),
  endpoints.findOne,
)
.delete(
  '/users/:username',
  auth,
  validateResponse(endpoints.RemoveUserResponseSchema),
  endpoints.remove,
)
.put(
  '/users/:username',
  auth,
  validateBody(endpoints.UpdateUserRequestSchema),
  validateResponse(endpoints.UpdateUserResponseSchema),
  endpoints.update,
)
.post(
  '/users/login',
  validateBody(endpoints.LoginUserRequestSchema),
  validateResponse(endpoints.LoginUserResponseSchema),
  endpoints.login,
)
.use(routes.organizationsRoute)
.use(routes.ticketsRoute)
.use(routes.commentsRoute);

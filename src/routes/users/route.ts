import * as express from 'express';

import { auth } from '../../core/auth';
import { pagination } from '../../core/pagination';
import { validateBody, validateResponse } from '../../core/validate';

import * as endpoints from './endpoints';

export const usersRoute = express.Router()
.get(
  '/users',
  auth,
  pagination,
  validateResponse(endpoints.FindUserResponseSchema),
  endpoints.find,
)
.get(
  '/users/:userId',
  auth,
  validateResponse(endpoints.FindOneUserResponseSchema),
  endpoints.findOne,
)
.delete(
  '/users/:userId',
  auth,
  validateResponse(endpoints.RemoveUserResponseSchema),
  endpoints.remove,
)
.put(
  '/users/:userId',
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
);

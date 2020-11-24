import * as express from 'express';

import { auth } from '../../../../core/auth';
import { validateResponse } from '../../../../core/validate';

import { UpdateCommentResponseSchema } from '../../endpoints/update/update-response.dto';

import * as endpoints from './endpoints';

export const likesRoute = express.Router()
.use(auth)
.put(
  '/comments/:commentId/likes',
  validateResponse(UpdateCommentResponseSchema),
  endpoints.update,
);

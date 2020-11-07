import { Request } from 'express';

import { IAuthPayload } from './auth-payload.interface';

export interface IAuthRequest extends Request {
  user?: IAuthPayload;
}

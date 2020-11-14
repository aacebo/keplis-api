import { Request } from 'express';

import { IAuthPayload } from './auth-payload.interface';

export interface IAuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IAuthPayload;
}

import { Request } from 'express';

import { Pagination } from './pagination.dto';

export interface IPaginationRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs> extends Request<P, ResBody, ReqBody, ReqQuery> {
  pagination?: Pagination;
  total?: number;
}

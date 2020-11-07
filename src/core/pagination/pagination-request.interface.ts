import { Request } from 'express';

import { Pagination } from './pagination.dto';

export interface IPaginationRequest extends Request {
  pagination?: Pagination;
  total?: number;
}
